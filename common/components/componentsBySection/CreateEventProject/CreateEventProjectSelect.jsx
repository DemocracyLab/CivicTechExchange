// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import { Container } from "flux/utils";
import _ from "lodash";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type { Validator } from "../../forms/FormValidation.jsx";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { FormFieldValidator } from "../../utils/validation.js";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import type { EventProjectAPIDetails } from "../../utils/EventProjectAPIUtils.js";
import InlineFormError from "../../forms/InlineFormError.jsx";
import CurrentUser, {
  UserContext,
  MyProjectData,
} from "../../utils/CurrentUser.js";
import FormSelector from "../../common/selection/FormSelector.jsx";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import url from "../../utils/url.js";

type FormFields = {|
  project_id: number,
|};

type Props = {|
  project: ?EventProjectAPIDetails,
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  owned_projects: $ReadOnlyArray<MyProjectData>,
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for selecting project to RSVP for event
 */
class CreateEventProjectSelect extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    const userContext: UserContext = CurrentUser.userContext();
    const owned_projects: $ReadOnlyArray<MyProjectData> =
      userContext.owned_projects;
    const projectId: ?number = url.argument("project_id");
    const formFields: FormFields = {
      project_id: projectId,
      project:
        owned_projects &&
        owned_projects.find(
          (project: MyProjectData) => project.project_id == projectId
        ),
    };

    const validations: $ReadOnlyArray<FormFieldValidator<FormFields>> = [
      {
        fieldName: "project",
        checkFunc: (formFields: FormFields) => {
          const valid: boolean = !_.isEmpty(formFields["project"]);
          return valid;
        },
        errorMessage: "Please Select Project",
      },
    ];

    UniversalDispatcher.dispatch({
      type: "SET_FORM_FIELDS",
      formFieldValues: formFields,
      validators: validations,
    });

    const formIsValid: boolean = FormValidation.isValid(
      formFields,
      validations
    );
    this.state = {
      formFields: formFields,
      formIsValid: formIsValid,
      owned_projects: owned_projects,
    };
    props.readyForSubmit(formIsValid);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    if (prevState?.formFields) {
      let state: State = _.clone(prevState) || {};
      state.formFields.project = FormFieldsStore.getFormFieldValue("project");
      state.formFields.project_id = state.formFields.project?.project_id;
      return state;
    }
    return prevState;
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <div className="form-group">
          <label>Please select one project to submit to the hackathon*</label>
          <HiddenFormFields
            sourceDict={{
              project_id: this.state.formFields.project_id,
            }}
          />
          <FormSelector
            id="project"
            isSearchable={true}
            isClearable={false}
            isMultiSelect={false}
            options={this.state.owned_projects}
            labelGenerator={(project: MyProjectData) => project.project_name}
            valueStringGenerator={(project: MyProjectData) =>
              project.project_id
            }
          />
          <InlineFormError id="project" />
        </div>
      </div>
    );
  }
}

export default Container.create(CreateEventProjectSelect, {
  withProps: true,
});
