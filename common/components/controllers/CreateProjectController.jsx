// @flow

import React from 'react';
import ImageUploadFormElement from '../forms/ImageUploadFormElement.jsx'
import CharacterCounter from '../forms/CharacterCounter.jsx'
import LinkList from '../forms/LinkList.jsx'
import FileUploadList from '../forms/FileUploadList.jsx'
import _ from 'lodash'

type FormFields = {|
  project_name: ?string,
  project_location: ?string,
  project_url: ?string,
  project_issue_area: ?string,
  project_description: ?string
|};

type Props = {|
  issues_elementid: string
|};
type State = {|
  issues: Array<[string, string]>,
  formIsValid: boolean,
  formFields: FormFields
|};

/**
 * Encapsulates form for creating projects
 */
class CreateProjectController extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    
    // TODO: Pass issue list in props once we have moved away from django rendering
    var issues_element = document.getElementById(this.props.issues_elementid);
    if (issues_element) {
      this.state = {
        issues: JSON.parse(issues_element.innerHTML),
        formIsValid: false,
        formFields: {
          project_name: null,
          project_location: null,
          project_url: null,
          project_issue_area: null,
          project_description: null
        }
      };
    }
  }
  
  onFormFieldChange(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.formFields[formFieldName] = event.target.value;
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
      <div className="CreateProjectController-root">
        
        <div className="form-group">
          <ImageUploadFormElement form_id="project_thumbnail_location"/>
        </div>
        
        <h2 className="form-group subheader">DETAILS</h2>
        <div className="form-group">
          <label htmlFor="project_name">Project Name</label>
          <input type="text" className="form-control" id="project_name" name="project_name" maxLength="200"
                 onChange={this.onFormFieldChange.bind(this, "project_name")}/>
        </div>
        
        <div className="form-group">
          <label htmlFor="project_location">Project Location</label>
          <input type="text" className="form-control" id="project_location" name="project_location" maxLength="200"
                 onChange={this.onFormFieldChange.bind(this, "project_location")}/>
        </div>
        <div className="form-group">
          <label htmlFor="project_url">Website URL</label>
          <input type="text" className="form-control" id="project_url" name="project_url" maxLength="200"
                 onChange={this.onFormFieldChange.bind(this, "project_url")}/>
        </div>
        
        <div className="form-group">
          <label htmlFor="project_issue_area">Issue Areas</label>
          <select id="project_issue_area" name="project_issue_area" className="form-control"
                  onChange={this.onFormFieldChange.bind(this, "project_issue_area")}>
            {this._renderIssues()}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="project_description">Describe This Project</label>
          <CharacterCounter elementId="project_description" maxLength="3000"/>
          <textarea className="form-control" id="project_description" name="project_description"
                    placeholder="This will appear as project introduction" rows="3" maxLength="3000"
                    onChange={this.onFormFieldChange.bind(this, "project_description")}></textarea>
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
  
  _renderIssues(): React$Node {
    if (this.state) {
      return this.state.issues.map((issue) => <option key={issue[0]} value={issue[0]}>{issue[1]}</option>);
    } else {
      return null;
    }
  }
}

export default CreateProjectController;
