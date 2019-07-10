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
|};
type State = {|
  error: string,
  formIsValid: boolean,
  formFields: FormFields,
  validations: $ReadOnlyArray<Validator>
|};

/**
 * Encapsulates form for Project Overview section
 */
class ProjectOverviewForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);

    const project: ProjectDetailsAPIData = props.project;
    this.state = {
      error: "",
      formIsValid: false,
      formFields: {
        project_name: project ? project.project_name : "",
        project_short_description: project ? project.project_short_description : "",
        project_issue_area: project ? project.project_issue_area : [],
        project_thumbnail: project ? project.project_thumbnail : ""
      },
      validations: [
        {
          checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_name"]),
          errorMessage: "Please enter Project Name"
        },
        {
          checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_short_description"]),
          errorMessage: "Please enter Project Description"
        }
      ]
    };
  }

  onValidationCheck(formIsValid: boolean): void {
    if(formIsValid !== this.state.formIsValid) {
      this.setState({formIsValid});
      this.props.readyForSubmit(formIsValid);
    }
  }

  // TODO: Put this is a helper library
  onFormFieldChange(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
  }
  
  // TODO: Put this is a helper library
  onTagChange(formFieldName: string, value: $ReadOnlyArray<TagDefinition>): void {
    this.state.formFields[formFieldName] = value;
  }

  render(): React$Node {
    return this.state.error ? this._renderError() : this._renderForm();
  }

  _renderError(): React$Node {
    return (
      <div className="EditProjectForm-error">
        {this.state.error}
      </div>
    );
  }

  _renderForm(): React$Node {
    return (
      <div className="EditProjectForm-root">

        <DjangoCSRFToken/>

        <div className="form-group">
          <ImageUploadFormElement form_id="project_thumbnail_location"
                                  buttonText="Upload Project Image"
                                  currentImage={this.state.formFields.project_thumbnail}/>
        </div>

        <div className="form-group">
          <label>Project Name</label>
          <input type="text" className="form-control" id="project_name" name="project_name" maxLength="60"
                 value={this.state.formFields.project_name} onChange={this.onFormFieldChange.bind(this, "project_name")}/>
        </div>

        <div className="form-group">
          <label>Issue Area</label>
          <TagSelector
            elementId="project_issue_area"
            value={this.state.formFields.project_issue_area}
            category={TagCategory.ISSUES}
            allowMultiSelect={false}
            onSelection={this.onTagChange.bind(this, "project_issue_area")}
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
                    value={this.state.formFields.project_short_description} onChange={this.onFormFieldChange.bind(this, "project_short_description")}></textarea>
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
