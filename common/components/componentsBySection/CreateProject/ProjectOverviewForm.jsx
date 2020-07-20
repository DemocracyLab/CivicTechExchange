// @flow

import React from "react";
import type {FileInfo} from "../../common/FileInfo.jsx";
import ImageCropUploadFormElement from "../../../components/forms/ImageCropUploadFormElement.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {TagDefinition, ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import formHelper, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import ProjectTermsModal from "../../common/confirmation/ProjectTermsModal.jsx"
import PseudoLink from "../../chrome/PseudoLink.jsx";
import _ from "lodash";


type FormFields = {|
  project_name: ?string,
  project_short_description: ?string,
  project_issue_area?: Array<TagDefinition>,
  project_thumbnail?: FileInfo,
  project_terms_of_service: ?boolean
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: () => () => boolean
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Project Overview section
 */
class ProjectOverviewForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    const formFields: FormFields = {
      project_name: project ? project.project_name : "",
      project_short_description: project ? project.project_short_description : "",
      project_issue_area: project ? project.project_issue_area : [],
      project_thumbnail: project ? project.project_thumbnail : "",
      project_terms_of_service: project ? true : false
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_name"]),
        errorMessage: "Please enter Project Name"
      },
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_short_description"]),
        errorMessage: "Please enter Project Description"
      },
      {
        checkFunc: (formFields: FormFields) => formFields["project_terms_of_service"],
        errorMessage: "Agree to terms of service"
      }
    ];

    const formIsValid: boolean = FormValidation.isValid(formFields, validations);
    this.state = {
      formIsValid: formIsValid,
      formFields: formFields,
      validations: validations
    };
    props.readyForSubmit(formIsValid);
    this.form = formHelper.setup();
  }

  componentDidMount() {
    // Initial validation check
    this.form.doValidation.bind(this)();
  }

  onValidationCheck(formIsValid: boolean): void {
    if(formIsValid !== this.state.formIsValid) {
      this.setState({formIsValid});
      this.props.readyForSubmit(formIsValid);
    }
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">

        <DjangoCSRFToken/>

        <div className="form-group">
          <ImageCropUploadFormElement form_id="project_thumbnail_location"
                                  buttonText="Browse Photos On Computer"
                                  currentImage={this.state.formFields.project_thumbnail}
                                  onSelection={this.form.onSelection.bind(this, "project_thumbnail")}
          />
        </div>

        <div className="form-group">
          <label>Project Name</label>
          <input type="text" className="form-control" id="project_name" name="project_name" maxLength="60"
                 value={this.state.formFields.project_name} onChange={this.form.onInput.bind(this, "project_name")}/>
        </div>

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

        <div className="form-group">
          <label>
            Short Description
          </label>
          <div className="character-count">
            { (this.state.formFields.project_short_description || "").length} / 140
          </div>
          <textarea className="form-control" id="project_short_description" name="project_short_description"
                    placeholder="Give a one-sentence description of this project" rows="2" maxLength="140"
                    value={this.state.formFields.project_short_description} onChange={this.form.onInput.bind(this, "project_short_description")}></textarea>
        </div>

        <div className="form-group">
            <input
              name="project_terms_of_service"
              id="project_terms_of_service"
              type="checkbox"
              onChange={this.form.onCheckbox.bind(this, "project_terms_of_service")}
            />
            <span>
              I have read and accepted the
              {" "}<PseudoLink text="Terms of Service" onClick={e => this.setState({termsOpen: true})}/>
            </span>

        </div>

        <ProjectTermsModal showModal={this.state.termsOpen} onSelection={() => this.setState({termsOpen: false})}/>

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
