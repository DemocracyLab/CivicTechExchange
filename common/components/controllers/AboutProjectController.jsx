// @flow

//TODO: validate all the active imports, these are the result of a messy merge
import React from 'react';
import _ from 'lodash'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
import ProjectDetails from '../componentsBySection/FindProjects/ProjectDetails.jsx';
import ContactProjectButton from "../common/projects/ContactProjectButton.jsx";
import ProjectVolunteerButton from "../common/projects/ProjectVolunteerButton.jsx";
import {LinkNames} from "../constants/LinkConstants.js";
import metrics from "../utils/metrics.js";
import AboutPositionEntry from "../common/positions/AboutPositionEntry.jsx";
import ProjectVolunteerModal from "../common/projects/ProjectVolunteerModal.jsx";
import CurrentUser from "../utils/CurrentUser.js";
import ProjectOwnersSection from "../common/owners/ProjectOwnersSection.jsx";
import VolunteerSection from "../common/volunteers/VolunteerSection.jsx";
import type {PositionInfo} from "../forms/PositionInfo.jsx";


type State = {|
  project: ?ProjectDetailsAPIData,
  showJoinModal: boolean,
  positionToJoin: ?PositionInfo,
  showPositionModal: boolean,
  shownPosition: ?PositionInfo,
  tabs: object
|};

class AboutProjectController extends React.PureComponent<{||}, State> {

  constructor(): void{
    super();
    this.state = {
    project: null,
    showContactModal: false,
    showPositionModal: false,
    shownPosition: null,
    tabs: {
      details: true,
      skills: false,
    }
  }
 }

  componentDidMount() {
    const projectId: string = (new RegExp("id=([^&]+)")).exec(document.location.search)[1];
    ProjectAPIUtils.fetchProjectDetails(projectId, this.loadProjectDetails.bind(this));
    metrics.logNavigateToProjectProfile(projectId);
  }

  loadProjectDetails(project) {
    this.setState({
      project: project,
    });
  }

  handleShowVolunteerModal(position: ?PositionInfo) {
    this.setState({
      showJoinModal: true,
      positionToJoin: position
    });
  }

  confirmJoinProject(confirmJoin: boolean) {
    if(confirmJoin) {
      window.location.reload(true);
    } else {
      this.setState({showJoinModal: false});
    }
  }

  changeHighlighted(tab) {
   let tabs = {
      details: false,
      skills: false,
      positions: false,
    }

    tabs[tab] = true;
    this.setState({tabs});
  }

  render(): $React$Node {
    return this.state.project ? this._renderDetails() : <div>Loading...</div>
  }

  _renderDetails(): React$Node {
    const project = this.state.project;
    const positions = project && project.project_positions;
    const skillsTab = this.state.tabs.skills ? 'AboutProjects_aHighlighted' : 'none';
    const detailsTab = this.state.tabs.details ? 'AboutProjects_aHighlighted' : 'none';
    const technologies = project && project.project_technologies
    return (
      <div className='AboutProjects-root'>
        <Grid container className='AboutProjects-container' spacing={0}>
          <Grid item xs={12} sm={3} className="AboutProjects-infoColumn">
            <Paper className='AboutProjects-paper' elevation={1} square={true}>

              <Grid className='AboutProjects-iconContainer'>
                <img className='AboutProjects-icon'src={project && project.project_thumbnail && project.project_thumbnail.publicUrl} />
              </Grid>

              <Divider />

              <Grid className='AboutProjects-details'>
                <ProjectDetails projectLocation={project && project.project_location}
                projectUrl={project && project.project_url}
                projectStage={project && !_.isEmpty(project.project_stage) ? project.project_stage[0].display_name : null}
                dateModified={project && project.project_date_modified}/>
              </Grid>

              <Divider />

            {project && !_.isEmpty(project.project_links) &&
              <React.Fragment>
                <Grid className='AboutProjects-links'>
                  <h4>Links</h4>
                  {this._renderLinks()}
                </Grid>
                <Divider />
              </React.Fragment>
            }



            { project && !_.isEmpty(project.project_files) &&
              <React.Fragment>
                <Grid className='AboutProjects-files'>
                  <h4>Files</h4>
                   {this._renderFiles()}
                </Grid>
                <Divider />
              </React.Fragment>
            }

          {project && !_.isEmpty(project.project_organization) &&
            <React.Fragment>
              <Grid className='AboutProjects-communities'>
                <h4>Communities</h4>
                <ul>
                  {
                    project.project_organization.map((org, i) => {
                      return <li key={i}>{org.display_name}</li>
                    })
                  }
                </ul>
              </Grid>
              <Divider />
            </React.Fragment>
          }

              <Grid className='AboutProjects-team'>
                <h4>Team</h4>
                  {
                    project && !_.isEmpty(project.project_owners)
                    ? <ProjectOwnersSection
                      owners={project.project_owners}
                      />
                    : null
                  }

                  {
                  project && !_.isEmpty(project.project_volunteers)
                    ? <VolunteerSection
                        volunteers={project.project_volunteers}
                        isProjectAdmin={CurrentUser.userID() === project.project_creator}
                        isProjectCoOwner={CurrentUser.isCoOwner(project)}
                        projectId={project.project_id}
                      />
                    : null
                  }
              </Grid>

            </Paper>
          </Grid>

          <Grid item xs={12} sm={9} className="AboutProjects-mainColumn">
            <Paper className='AboutProjects-paper' elevation={1} square={true}>
              <Grid className='AboutProjects-intro' container direction='row' alignItems='flex-start' justify='center'>
                  <Grid className='AboutProjects-description' item xs={12} sm={9}>
                    <h1>{project && project.project_name}</h1>
                    <p className='AboutProjects-description-issue'>{project && project.project_issue_area && project.project_issue_area.map(issue => issue.display_name).join(',')}</p>
                    <p>{project && project.project_short_description}</p>
                  </Grid>

                  <ProjectVolunteerModal
                    projectId={this.state.project && this.state.project.project_id}
                    positions={this.state.project && this.state.project.project_positions}
                    positionToJoin={this.state.positionToJoin}
                    showModal={this.state.showJoinModal}
                    handleClose={this.confirmJoinProject.bind(this)}
                  />

                  <Grid className='AboutProjects-owner' item xs={12} sm={3}>
                    <ContactProjectButton project={project}/>
                    <ProjectVolunteerButton
                      project={project}
                      onVolunteerClick={this.handleShowVolunteerModal.bind(this)}
                    />
                  </Grid>
              <div className="AboutProjects_tabs">
                <a onClick={() => this.changeHighlighted('details')} className={detailsTab}href="#project-details">Details</a>
                <a onClick={() => this.changeHighlighted('skills')} className={positions.length?skillsTab:'AboutProjects-hide'} href="#skills-needed">Skills Needed</a>
              </div>

              </Grid>
              <Divider />

              <Grid className='AboutProjects-description-details'>
                <div id='project-details'>{project.project_description}</div>
              <Grid className='AboutProjects-skills-container' container direction='row'>
                <div className={positions.length?'AboutProjects-skills' :'AboutProjects-hide'}>
                  <p id='skills-needed' className='AboutProjects-skills-title'>Skills Needed</p>
                  {positions.map(position => <p>{position.roleTag.display_name}</p>)}
                </div>
                <div className={technologies.length?'AboutProjects-technologies':'AboutProjects-hide'}>
                  <p className='AboutProjects-tech-title'>Technologies Used</p>
                  {technologies.map(tech => <p>{tech.display_name}</p>)}
                </div>
                <Grid item xs={6}></Grid>
                </Grid>
              </Grid>
              <Divider/>
              <Grid className='AboutProjects-positions-available' container>
              <div id="positions-available">{project && !_.isEmpty(project.project_positions) && this._renderPositions()}</div>
              </Grid>
            </Paper>
          </Grid>

        </Grid>
      </div>
    )
  }

  _renderFiles(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_files && project.project_files.map((file, i) =>
      <div key={i}>
        <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
      </div>
    );
  }

  _renderLinks(): ?Array<React$Node> {
    const project = this.state.project;
    return project && project.project_links && project.project_links.map((link, i) =>
      <div className="Link-listitem"key={i}>
        <a href={link.linkUrl} target="_blank" rel="noopener noreferrer">{this._legibleName(link.linkName)}</a>
      </div>
    );
  }

    _legibleName(input) {
    //replaces specific linkNames for readability
    return LinkNames[input] || input;
  }

  _renderPositions(): ?Array<React$Node> {
    const project: ProjectDetailsAPIData = this.state.project;
    const canApply: boolean = CurrentUser.canVolunteerForProject(project);
    return project && project.project_positions && _.chain(project.project_positions).sortBy(['roleTag.subcategory', 'roleTag.display_name']).value()
      .map((position, i) => {
        return <AboutPositionEntry
          key={i}
          position={position}
          onClickApply={canApply ? this.handleShowVolunteerModal.bind(this, position) : null}
        />;
      });
    }
}

export default AboutProjectController;
