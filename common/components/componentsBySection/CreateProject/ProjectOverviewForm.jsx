// @flow

import React from "react";
import type {FileInfo} from "../../common/FileInfo.jsx";
import ImageUploadFormElement from "../../../components/forms/ImageUploadFormElement.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {TagDefinition, ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";


type FormFields = {|
  project_name: ?string,
  project_short_description: ?string,
  project_issue_area?: Array<TagDefinition>,
  project_thumbnail?: FileInfo,
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
      project_thumbnail: project ? project.project_thumbnail : ""
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_name"]),
        errorMessage: "Please enter Project Name"
      },
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_short_description"]),
        errorMessage: "Please enter Project Description"
      }
    ];
  
    const formIsValid: boolean = FormValidation.isValid(formFields, validations);
    this.state = {
      formIsValid: formIsValid,
      formFields: formFields,
      validations: validations
    };
    props.readyForSubmit(formIsValid);
    this.form = form.setup();
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
          <ImageUploadFormElement form_id="project_thumbnail_location"
                                  buttonText="Upload Project Image"
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
