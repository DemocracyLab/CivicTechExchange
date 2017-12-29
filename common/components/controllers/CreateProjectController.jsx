// @flow

import React from 'react';
import ImageUploadFormElement from '../forms/ImageUploadFormElement.jsx'
import CharacterCounter from '../forms/CharacterCounter.jsx'
import LinkList from '../forms/LinkList.jsx'
import FileUploadList from '../forms/FileUploadList.jsx'


type Props = {|

|};
type State = {|

|};

/**
 * Encapsulates form for creating projects
 */
class CreateProjectController extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
  }
  
  render(): React$Node {
    return (
      <div>

        <div className="form-group">
          <ImageUploadFormElement form_id="project_thumbnail_location"/>
        </div>
    
        <h2 className="form-group subheader">DETAILS</h2>
        <div className="form-group">
          <label htmlFor="project_name">Project Name</label>
          <input type="text" className="form-control" id="project_name" name="project_name"/>
        </div>
    
        <div className="form-group">
          <label htmlFor="project_location">Project Location</label>
          <input type="text" className="form-control" id="project_location" name="project_location"/>
        </div>
        <div className="form-group">
          <label htmlFor="website_url">Website URL</label>
          <input type="text" className="form-control" id="website_url" name="website_url"/>
        </div>
    
        <div className="form-group">
          <label htmlFor="project_issue_area">Issue Areas</label>
          <select id="project_issue_area" name="project_issue_area" className="form-control">
            {/*TODO: Inject issues from backend*/}
          </select>
        </div>
    
        <div className="form-group">
          <label htmlFor="project_description">Describe This Project</label>
          {/*TODO: Fix character counter control to work within React component*/}
          <div id="CharacterCounter" data-elementId="project_description" data-maxLength="3000"/>
          <textarea className="form-control" id="project_description" name="project_description" placeholder="This will appear as project introduction" rows="3" maxLength="3000"></textarea>
        </div>
        
        <h2 className="form-group subheader">LINKS</h2>
        <LinkList elementId="project_links" links="[]"/>
    
        <h2 className="form-group subheader">FILES</h2>
        <FileUploadList elementId="project_files" files="[]"/>
    
        <div className="form-group pull-right">
          <div className='text-right'>
            <input type="submit" className="btn_outline save_btn" value="Save Project"/>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateProjectController;
