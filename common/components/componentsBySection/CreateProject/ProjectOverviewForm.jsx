// @flow

import React from "react";
import type { FileInfo } from "../../common/FileInfo.jsx";
import ImageCropUploadFormElement from "../../../components/forms/ImageCropUploadFormElement.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type { Validator } from "../../../components/forms/FormValidation.jsx";
import type {
  TagDefinition,
  ProjectDetailsAPIData,
} from "../../../components/utils/ProjectAPIUtils.js";
import formHelper, { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import TermsModal, {
  TermsTypes,
} from "../../common/confirmation/TermsModal.jsx";
import PseudoLink from "../../chrome/PseudoLink.jsx";
import CheckBox from "../../common/selection/CheckBox.jsx";
import _ from "lodash";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { FormFieldValidator } from "../../utils/validation.js";

type FormFields = {|
  project_name: ?string,
  project_short_description: ?string,
  project_issue_area?: Array<TagDefinition>,
  project_thumbnail?: FileInfo,
  didCheckTerms: boolean,
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  termsOpen: boolean,
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Project Overview section
 */
class ProjectOverviewForm extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    const formFields: FormFields = {
      project_name: project ? project.project_name : "",
      project_short_description: project
        ? project.project_short_description
        : "",
      project_issue_area: project ? project.project_issue_area : [],
      project_thumbnail: project ? project.project_thumbnail : "",
      didCheckTerms: !!project,
    };

    const validations: $ReadOnlyArray<FormFieldValidator<FormFields>> = [
      {
        fieldName: "project_name",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["project_name"]),
        errorMessage: "Please enter Project Name",
      },
      {
        fieldName: "project_short_description",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["project_short_description"]),
        errorMessage: "Please enter Project Description",
      },
      {
        checkFunc: (formFields: FormFields) => formFields.didCheckTerms,
        errorMessage: "Agree to Terms of Use",
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
      formIsValid: formIsValid,
      formFields: formFields,
      validations: validations,
      termsOpen: false,
    };
    props.readyForSubmit(formIsValid);
    this.form = formHelper.setup();
  }

  componentDidMount() {
    // Initial validation check
    this.form.doValidation.bind(this)();
  }

  onValidationCheck(formIsValid: boolean): void {
    if (formIsValid !== this.state.formIsValid) {
      this.setState({ formIsValid });
      this.props.readyForSubmit(formIsValid);
    }
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <div className="form-group">
          <ImageCropUploadFormElement
            form_id="project_thumbnail"
            buttonText="Browse Photos On Computer"
          />
        </div>

        <TextFormField
          id="project_name"
          label="Project Name"
          type={TextFormFieldType.SingleLine}
          required={true}
          maxLength={60}
        />

        <div className="form-group">
          <label>Issue Area</label>
          <TagSelector
            elementId="project_issue_area"
            value={this.state.formFields.project_issue_area}
            category={TagCategory.ISSUES}
            allowMultiSelect={false}
            onSelection={this.form.onSelection.bind(this, "project_issue_area")}
          />
        </div>

        <TextFormField
          id="project_short_description"
          label="Short Description"
          type={TextFormFieldType.MultiLine}
          rows={2}
          placeholder="Give a one-sentence description of this project"
          required={true}
          showCount={true}
          maxLength={140}
        />

        {!this.props.project && (
          <div>
            <CheckBox
              id="didCheckTerms"
              value={this.state.formFields.didCheckTerms}
              onCheck={this.form.onSelection.bind(this, "didCheckTerms")}
            />
            <span>
              {" "}
              I have read and accepted the{" "}
              <PseudoLink
                text="Terms of Use"
                onClick={e => this.setState({ termsOpen: true })}
              />
            </span>
          </div>
        )}

        <TermsModal
          termsType={TermsTypes.OrgSignup}
          showModal={this.state.termsOpen}
          onSelection={() => this.setState({ termsOpen: false })}
        />

        <FormValidation
          validations={this.state.validations}
          onValidationCheck={this.onValidationCheck.bind(this)}
          formState={this.state.formFields}
        />
      </div>
    );
  }
}

export default ProjectOverviewForm;
