// @flow

import React from 'react';
import ImageUploadFormElement from '../../../components/forms/ImageUploadFormElement.jsx'
import LinkList from '../../../components/forms/LinkList.jsx'
import FileUploadList from '../../../components/forms/FileUploadList.jsx'
import TagCategory from '../../common/tags/TagCategory.jsx'
import TagSelect from '../../common/tags/TagSelect.jsx'
import DjangoCSRFToken from '../../common/DjangoCSRFToken.jsx'
import ProjectAPIUtils from '../../../components/utils/ProjectAPIUtils.js';
import _ from 'lodash'

type FormFields = {|
  project_name: ?string,
  project_location: ?string,
  project_url: ?string,
  project_description: ?string
|};

type Props = {|
  projectId: number
|};
type State = {|
  formIsValid: boolean,
  formFields: FormFields
|};

/**
 * Encapsulates form for creating/editing projects
 */
class EditProjectForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
  
    this.state = {
      formIsValid: false,
      formFields: {
        project_name: "",
        project_location: "",
        project_url: "",
        project_description: ""
      }
    };
  }
  
  componentWillMount(): void {
    ProjectAPIUtils.fetchProjectDetails(this.props.projectId, this.loadProjectDetails.bind(this));
  }
  
  loadProjectDetails(project: ProjectDetailsAPIData) {
    this.setState({
      formFields: {
        project_name: project.project_name,
        project_location: project.project_location,
        project_url: project.project_url,
        project_description: project.project_description
      }
    });
    this.checkFormValidity();
  }
  
  onFormFieldChange(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
    this.checkFormValidity();
  }
  
  onComponentChange(formFieldName: string, newValue: string): void {
    this.state.formFields[formFieldName] = newValue;
    this.checkFormValidity();
  }
  
  checkFormValidity(): void {
    var formFields = this.state.formFields;
    
    var valid = !_.isEmpty(formFields["project_name"]) && !_.isEmpty(formFields["project_description"]);
    this.setState({
      formIsValid: valid
    });
  }
  
  
  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        
        <DjangoCSRFToken/>
        
        <div className="form-group">
          <ImageUploadFormElement form_id="project_thumbnail_location"/>
        </div>
        
        <h2 className="form-group subheader">DETAILS</h2>
        <div className="form-group">
          <label htmlFor="project_name">Project Name</label>
          <input type="text" className="form-control" id="project_name" name="project_name" maxLength="200"
                 value={this.state.formFields.project_name} onChange={this.onFormFieldChange.bind(this, "project_name")}/>
        </div>
        
        <div className="form-group">
          <label htmlFor="project_location">Project Location</label>
          <input type="text" className="form-control" id="project_location" name="project_location" maxLength="200"
                 value={this.state.formFields.project_location} onChange={this.onFormFieldChange.bind(this, "project_location")}/>
        </div>
        <div className="form-group">
          <label htmlFor="project_url">Website URL</label>
          <input type="text" className="form-control" id="project_url" name="project_url" maxLength="200"
                 value={this.state.formFields.project_url} onChange={this.onFormFieldChange.bind(this, "project_url")}/>
        </div>
        
        <div className="form-group">
          <label htmlFor="project_issue_area">Issue Areas</label>
          <TagSelect
            elementId="project_issue_area"
            category={TagCategory.ISSUES}
            onSelection={this.onComponentChange.bind(this, "project_issue_area")}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="project_description">Describe This Project</label>
          <div className="character-count">
            {this.state.formFields.project_description.length} / 3000
          </div>
          <textarea className="form-control" id="project_description" name="project_description"
                    placeholder="This will appear as project introduction" rows="3" maxLength="3000"
                    value={this.state.formFields.project_description} onChange={this.onFormFieldChange.bind(this, "project_description")}></textarea>
        </div>
        
        <h2 className="form-group subheader">LINKS</h2>
        <LinkList elementid="project_links" links="[]"/>
        
        <h2 className="form-group subheader">FILES</h2>
        <FileUploadList elementid="project_files" files="[]"/>
        
        <div className="form-group pull-right">
          <div className='text-right'>
            <input disabled={!this.state.formIsValid} type="submit" className="btn_outline save_btn"
                   value="Save Project"/>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProjectForm;
