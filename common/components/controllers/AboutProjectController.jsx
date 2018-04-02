// @flow

import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import { Button } from 'react-bootstrap';
import ContactProjectModal from '../common/projects/ContactProjectModal.jsx'
import TagsDisplay from '../common/tags/TagsDisplay.jsx'
import url from '../utils/url.js'
import _ from 'lodash'

import React from 'react';

type State = {|
  project: ?ProjectDetailsAPIData,
|};

class AboutProjectController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();

    this.state = {
      project: null,
      showModal: false
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  componentDidMount() {
    var projectId = (new RegExp("id=([^&]+)")).exec(document.location.search)[1];
    ProjectAPIUtils.fetchProjectDetails(projectId, this.loadProjectDetails.bind(this));
  }
  
  loadProjectDetails(project: ProjectDetailsAPIData) {
    this.setState({
      project: project
    });
  }
  

  handleClose() {
    this.setState({ showModal: false });
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  render(): React$Node {
    return this.state.project ? this._renderDetails() : <div>Loading...</div>
  }
  
  _renderDetails(): React$Node {
    const project = this.state.project;
    return (
      <div className="AboutProjectController-root">
        <div className="container-fluid">
          <div className="row" style={{margin: "30px 40px 0 40px"}}>
            <div className="col-sm-5">
              <div className="row">
                <div className="col-sm-auto">
                  <img className="upload_img upload_img_bdr" src={project && project.project_thumbnail && project.project_thumbnail.publicUrl} />
                </div>
                <div className="col">
                  <div className="row">
                    <div className="col">
                      {project && project.project_name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      {project && !_.isEmpty(project.project_issue_area) && project.project_issue_area[0].label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
            </div>
            <div className="col col-sm-3">
              <div className="row">
                {this._renderProjectHomepageLink()}
              </div>
              <div className="row">
                <div className="col">
                  <i className="fa fa-map-marker fa-1" aria-hidden="true"></i>
                  {project && project.project_location}
                </div>
              </div>
              <div className="row">
                <Button className="ProjectSearchBar-submit" type="button" onClick={this.handleShow}>Contact Project</Button>
              </div>
            </div>
          </div>
          <div>
            <ContactProjectModal
              projectId={this.state.project && this.state.project.project_id}
              showModal={this.state.showModal}
              handleClose={this.handleClose}
            />
          </div>
  
          <div className="row" style={{margin: "30px 40px 0 40px"}}>
            <div className="col">
              TECHNOLOGIES USED
              <div>
                <TagsDisplay tags={project && project.project_technologies}/>
              </div>
            </div>
          </div>
    
          <div className="row" style={{margin: "30px 40px 0 40px"}}>
            <div className="col">
              PROJECT DETAILS
              <div>
                {project && project.project_description}
              </div>
            </div>
          </div>
    
          <div className="row" style={{margin: "30px 40px 0 40px"}}>
            <div className='col'>
              <h2 className="form-group subheader">LINKS</h2>
              {this._renderLinks()}
            </div>
          </div>
    
          <div className="row" style={{margin: "30px 40px 0 40px"}}>
            <div className='col'>
              <h2 className="form-group subheader">FILES</h2>
              {this._renderFiles()}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  _renderProjectHomepageLink(): React$Node {
    if(this.state.project && this.state.project.project_url) {
      return <div className="col">
        <i className="fa fa-link fa-1" aria-hidden="true"></i>
        <a href={this.state.project.project_url}>{ this.state.project.project_url.length > 100
          ? "Project Homepage"
          : url.beautify(this.state.project.project_url)}</a>
      </div>
    }
  }
  
  _renderLinks(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_links && project.project_links.map((link, i) =>
      <div key={i}>
        <a href={link.linkUrl}>{link.linkName}</a>
      </div>
    );
  }
  
  _renderFiles(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_files && project.project_files.map((file, i) =>
      <div key={i}>
        <a href={file.publicUrl}>{file.fileName}</a>
      </div>
    );
  }
}

export default AboutProjectController;
