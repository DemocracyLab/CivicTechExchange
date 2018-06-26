// @flow

import React from 'react';
import type {LinkInfo} from '../../../components/forms/LinkInfo.jsx'
import type {FileInfo} from '../../common/FileInfo.jsx'
import ImageUploadFormElement from '../../../components/forms/ImageUploadFormElement.jsx'
import LinkList from '../../../components/forms/LinkList.jsx'
import FileUploadList from '../../../components/forms/FileUploadList.jsx'
import TagCategory from '../../common/tags/TagCategory.jsx'
import TagSelector from '../tags/TagSelector.jsx'
import DjangoCSRFToken from 'django-react-csrftoken'
import FormValidation from '../../../components/forms/FormValidation.jsx'
import type {Validator} from '../../../components/forms/FormValidation.jsx'
import ProjectAPIUtils from '../../../components/utils/ProjectAPIUtils.js';
import type {APIError, TagDefinition, ProjectDetailsAPIData} from '../../../components/utils/ProjectAPIUtils.js';
import url from '../../utils/url.js'
import {PositionInfo} from "../../forms/PositionInfo.jsx";
import PositionList from "../../forms/PositionList.jsx";
import _ from 'lodash'


type FormFields = {|
  project_name: ?string,
  project_location: ?string,
  project_url: ?string,
  project_description: ?string,
  project_issue_area?: Array<TagDefinition>,
  project_technologies?: Array<TagDefinition>,
  project_positions?: Array<PositionInfo>,
  project_links: Array<LinkInfo>,
  project_files: Array<FileInfo>,
  project_thumbnail?: FileInfo
|};

type Props = {|
  projectId?: number
|};
type State = {|
  error: string,
  formIsValid: boolean,
  formFields: FormFields,
  validations: $ReadOnlyArray<Validator>
|};

/**
 * Encapsulates form for creating/editing projects
 */
class EditProjectForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
  
    this.state = {
      error: "",
      formIsValid: false,
      formFields: {
        project_name: "",
        project_location: "",
        project_url: "",
        project_description: "",
        project_links: [],
        project_files: []
      },
      validations: [
        {
          checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_name"]),
          errorMessage: "Please enter Project Name"
        },
        {
          checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_description"]),
          errorMessage: "Please enter Project Description"
        }
      ]
    };
  }
  
  onValidationCheck(formIsValid: boolean): void {
    if(formIsValid !== this.state.formIsValid) {
      this.setState({formIsValid});
    }
  }
  
  componentDidMount(): void {
    if(this.props.projectId) {
      ProjectAPIUtils.fetchProjectDetails(this.props.projectId, this.loadProjectDetails.bind(this), this.handleLoadProjectError.bind(this));
    }
  }
  
  loadProjectDetails(project: ProjectDetailsAPIData): void {
    if(project.project_creator != window.DLAB_GLOBAL_CONTEXT.userID) {
      this.setState({
        error: "You are not authorized to edit this Project"
      });
    } else {
      this.setState({
        formFields: {
          project_name: project.project_name,
          project_location: project.project_location,
          project_url: project.project_url,
          project_description: project.project_description,
          project_issue_area: project.project_issue_area,
          project_technologies: project.project_technologies,
          project_links: _.cloneDeep(project.project_links),
          project_files: _.cloneDeep(project.project_files),
          project_positions: _.cloneDeep(project.project_positions),
          project_thumbnail: project.project_thumbnail
        }
      });
    }
  }
  
  handleLoadProjectError(error: APIError): void {
    this.setState({
      error: "Failed to load project information"
    });
  }
  
  onFormFieldChange(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
  }
  
  onTagChange(formFieldName: string, value: $ReadOnlyArray<TagDefinition>): void {
    this.state.formFields[formFieldName] = value;
  }
  
  onSubmit(): void {
    //Sanitize project url if necessary
    if(this.state.formFields.project_url) {
      this.state.formFields.project_url = url.appendHttpIfMissingProtocol(this.state.formFields.project_url);
    }
    this.forceUpdate();
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
          <ImageUploadFormElement form_id="project_thumbnail_location" currentImage={this.state.formFields.project_thumbnail}/>
        </div>
        
        <h2 className="form-group subheader">DETAILS</h2>
        <div className="form-group">
          <label htmlFor="project_name">Project Name</label>
          <input type="text" className="form-control" id="project_name" name="project_name" maxLength="60"
                 value={this.state.formFields.project_name} onChange={this.onFormFieldChange.bind(this, "project_name")}/>
        </div>
        
        <div className="form-group">
          <label htmlFor="project_url">Website URL</label>
          <input type="text" className="form-control" id="project_url" name="project_url" maxLength="2075"
                 value={this.state.formFields.project_url} onChange={this.onFormFieldChange.bind(this, "project_url")}/>
        </div>

        <div className="form-group">
          <label htmlFor="project_location">Project Location</label>
          <select name="project_location" id="project_location" className="form-control" value={this.state.formFields.project_location} onChange={this.onFormFieldChange.bind(this, "project_location")}>
            <option value={this.state.formFields.project_location}>{this.state.formFields.project_location}</option>
            <option value="Redmond, WA">Redmond, WA</option>
            <option value="Kirkland, WA">Kirkland, WA</option>
            <option value="Bellevue, WA">Bellevue, WA</option>
            <option value="Seattle, WA">Seattle, WA</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="project_issue_area">Issue Areas</label>
          <TagSelector
            elementId="project_issue_area"
            value={this.state.formFields.project_issue_area}
            category={TagCategory.ISSUES}
            allowMultiSelect={false}
            onSelection={this.onTagChange.bind(this, "project_issue_area")}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="project_technologies">Technology Used</label>
          <TagSelector
            elementId="project_technologies"
            value={this.state.formFields.project_technologies}
            category={TagCategory.TECHNOLOGIES_USED}
            allowMultiSelect={true}
            onSelection={this.onTagChange.bind(this, "project_technologies")}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="project_description">Describe This Project</label>
          <div className="character-count">
            { (this.state.formFields.project_description || "").length} / 3000
          </div>
          <textarea className="form-control" id="project_description" name="project_description"
                    placeholder="This will appear as project introduction" rows="3" maxLength="3000"
                    value={this.state.formFields.project_description} onChange={this.onFormFieldChange.bind(this, "project_description")}></textarea>
        </div>
  
        <h2 className="form-group subheader">OPEN POSITIONS</h2>
        <PositionList elementid="project_positions" positions={this.state.formFields.project_positions}/>
        
        <h2 className="form-group subheader">LINKS</h2>
        <LinkList elementid="project_links" links={this.state.formFields.project_links}/>
        
        <h2 className="form-group subheader">FILES</h2>
        <FileUploadList elementid="project_files" files={this.state.formFields.project_files}/>
  
        <FormValidation
          validations={this.state.validations}
          onValidationCheck={this.onValidationCheck.bind(this)}
          formState={this.state.formFields}
        />
        
        <div className="form-group pull-right">
          <div className='text-right'>
            <input disabled={!this.state.formIsValid} type="submit" className="btn_outline save_btn"
                   value="Save Project" onClick={this.onSubmit.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProjectForm;
