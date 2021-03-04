// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";
import _ from "lodash";
import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import StepIndicatorBars from "../common/StepIndicatorBars.jsx";
import LoadingMessage from "../chrome/LoadingMessage.jsx";
import utils from "../utils/utils.js";

export type FormWorkflowStepConfig<T> = {|
  header: string,
  subHeader: string,
  formComponent: React$Node,
  onSubmit: (
    SyntheticEvent<HTMLFormElement>,
    HTMLFormElement,
    (T) => void
  ) => void,
  onSubmitSuccess: T => void,
|};

type Props<T> = {|
  steps: $ReadOnlyArray<FormWorkflowStepConfig>,
  formFields: T,
  isLoading: boolean,
|};

type State<T> = {|
  currentStep: number,
  formIsValid: boolean,
  fieldsUpdated: boolean,
  showConfirmDiscardChanges: boolean,
  navigateToStepUponDiscardConfirmation: number,
  savedEmblemVisible: boolean,
  isSubmitting: boolean,
  clickedNext: boolean,
  initialFormFields: T,
  currentFormFields: T,
  preSubmitProcessing: ?Function,
|};

/**
 * Encapsulates form for creating projects
 */
class FormWorkflow<T> extends React.PureComponent<Props<T>, State<T>> {
  constructor(props: Props): void {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      currentStep: 0,
      formIsValid: false,
      fieldsUpdated: false,
      savedEmblemVisible: false,
      isSubmitting: false,
      clickedNext: false,
      showConfirmDiscardChanges: false,
      initialFormFields: null,
      currentFormFields: null,
      preSubmitProcessing: null,
    };
    // TODO: Replace with Guard helper function
    this.onSubmit = _.debounce(this.onSubmit.bind(this), 1000, {
      leading: true,
    });
  }

  navigateToStep(step: number): void {
    if (this.state.fieldsUpdated) {
      this.setState({
        navigateToStepUponDiscardConfirmation: step,
        showConfirmDiscardChanges: true,
      });
    } else {
      this.setState(
        Object.assign(this.resetPageState(), {
          currentStep: step,
        }),
        utils.navigateToTopOfPage
      );
      this.forceUpdate();
    }
  }

  resetPageState(state: ?State): State {
    let _state: State = state || this.state;
    return Object.assign(_state, {
      fieldsUpdated: false,
      formIsValid: false,
      initialFormFields: null,
      currentFormFields: null,
    });
  }

  onValidationCheck(formIsValid: boolean, preSubmitProcessing: Function): void {
    if (formIsValid !== this.state.formIsValid) {
      this.setState({ formIsValid });
    }

    if (preSubmitProcessing !== this.state.preSubmitProcessing) {
      this.setState({ preSubmitProcessing });
    }
  }

  onFormUpdate(formFields: {||}): void {
    !this.state.initialFormFields
      ? this.setState(
          {
            initialFormFields: _.cloneDeep(formFields),
            currentFormFields: formFields,
          },
          this.setFieldsUpdated()
        )
      : this.setState(
          { currentFormFields: formFields },
          this.setFieldsUpdated()
        );
  }

  setFieldsUpdated(): void {
    _.isEqual(this.state.initialFormFields, this.state.currentFormFields)
      ? this.setState({ fieldsUpdated: false })
      : this.setState({ fieldsUpdated: true });
  }

  confirmDiscardChanges(confirmDiscard: boolean): void {
    let confirmState: State = this.state;
    confirmState.showConfirmDiscardChanges = false;
    if (confirmDiscard) {
      confirmState.currentStep = this.state.navigateToStepUponDiscardConfirmation;
      confirmState = this.resetPageState(confirmState);
    }

    this.setState(confirmState);
    this.forceUpdate(utils.navigateToTopOfPage);
  }

  onSubmit(event: SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
    const currentStep: FormWorkflowStepConfig = this.props.steps[
      this.state.currentStep
    ];
    this.setState({ isSubmitting: true });
    const submitFunc: Function = () => {
      currentStep.onSubmit(
        event,
        this.formRef,
        this.onSubmitSuccess.bind(this, currentStep.onSubmitSuccess)
      );
    };
    this.state.preSubmitProcessing
      ? this.state.preSubmitProcessing(submitFunc)
      : submitFunc();
  }

  onSubmitSuccess(onStepSubmitSuccess: T => void, formFields: T) {
    function submitSuccess() {
      onStepSubmitSuccess(formFields);
      this.setState(
        this.resetPageState({
          clickedNext: false,
          currentStep: this.state.currentStep + 1,
          fieldsUpdated: false,
          savedEmblemVisible: false,
          isSubmitting: false,
        })
      );
    }
    if (this.state.fieldsUpdated) {
      this.setState(this.resetPageState({ savedEmblemVisible: true }));
      setTimeout(() => {
        submitSuccess.call(this);
      }, 500);
    } else {
      submitSuccess.call(this);
    }
  }

  render(): React$Node {
    const currentStep: FormWorkflowStepConfig = this.props.steps[
      this.state.currentStep
    ];

    return (
      <React.Fragment>
        <ConfirmationModal
          showModal={this.state.showConfirmDiscardChanges}
          message="You have unsaved changes on this form. Do you want to discard these changes? (To save your changes press Next on the form.)"
          onSelection={this.confirmDiscardChanges.bind(this)}
        />

        <div className="create-form white-bg container-fluid">
          <div className="bounded-content">
            <h1>{currentStep.header}</h1>
            <h2>{currentStep.subHeader}</h2>
            <StepIndicatorBars
              stepCount={this.props.steps.length + 1}
              currentlySelected={this.state.currentStep}
            />
          </div>
        </div>

        {this.props.isLoading ? <LoadingMessage /> : this._renderForm()}
      </React.Fragment>
    );
  }

  _renderForm(): React$Node {
    const FormComponent: React$Node = this.props.steps[this.state.currentStep]
      .formComponent;
    return (
      <form
        onSubmit={this.onSubmit.bind(this)}
        method="post"
        ref={this.formRef}
      >
        <div className="create-form grey-bg container">
          {/*TODO: Rename projects prop to something generic*/}
          <FormComponent
            project={this.props.formFields}
            readyForSubmit={this.onValidationCheck.bind(this)}
            onFormUpdate={this.onFormUpdate.bind(this)}
          />
        </div>

        <div className="create-form white-bg container-fluid">
          <div className="create-form-buttonrow">
            <Button
              variant="outline-secondary"
              type="button"
              title="Back"
              disabled={this.onFirstStep()}
              onClick={this.navigateToStep.bind(
                this,
                this.state.currentStep - 1
              )}
            >
              Back
            </Button>

            {!this.state.savedEmblemVisible ? (
              ""
            ) : (
              <span className="create-project-saved-emblem">
                <i className={GlyphStyles.CircleCheck} aria-hidden="true"></i>{" "}
                Saved
              </span>
            )}

            <button
              type="submit"
              className="btn btn-primary create-btn"
              disabled={!this.state.formIsValid || this.state.isSubmitting}
            >
              {this.state.isSubmitting ? (
                <i
                  className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.LG)}
                ></i>
              ) : this.onLastStep() ? (
                "PUBLISH"
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </form>
    );
  }

  onLastStep(): boolean {
    return this.state.currentStep >= this.props.steps.length - 1;
  }

  onFirstStep(): boolean {
    return this.state.currentStep === 0;
  }
}

export default FormWorkflow;
