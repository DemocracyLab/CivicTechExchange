// @flow

import React from 'react';
import _ from "lodash";
import ProjectAPIUtils,{ProjectDetailsAPIData} from '../../utils/ProjectAPIUtils.js';
import ProjectDetails from '../../componentsBySection/FindProjects/ProjectDetails.jsx';
import ContactProjectButton from "./ContactProjectButton.jsx";
import ContactVolunteersButton from "./ContactVolunteersButton.jsx";
import ProjectVolunteerButton from "./ProjectVolunteerButton.jsx";
import ProjectVolunteerModal from "./ProjectVolunteerModal.jsx";
import ProjectCommitCard from "./ProjectCommitCard.jsx";
import AboutPositionEntry from "../positions/AboutPositionEntry.jsx";
import ProjectOwnersSection from "../owners/ProjectOwnersSection.jsx";
import VolunteerSection from "../volunteers/VolunteerSection.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import type {PositionInfo} from "../../forms/PositionInfo.jsx";
import CurrentUser from "../../utils/CurrentUser.js";
import Headers from "../Headers.jsx";
import Truncate from "../../utils/truncate.js";
import Sort from "../../utils/sort.js";
import {LinkTypes} from "../../constants/LinkConstants.js";
import InviteProjectToGroupButton from "./InviteProjectToGroupButton.jsx";
import ApproveGroupsSection from "./ApproveGroupsSection.jsx";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";


type Props = {|
  project: ?ProjectDetailsAPIData,
  viewOnly: boolean
|};

type State = {|
  project: ?ProjectDetailsAPIData,
  volunteers: ?$ReadOnlyArray<VolunteerDetailsAPIData>,
  showJoinModal: boolean,
  positionToJoin: ?PositionInfo,
  showPositionModal: boolean,
  shownPosition: ?PositionInfo,
  tabs: object,
  maxActivity: number
|};

class AboutProjectDisplay extends React.PureComponent<Props, State> {

  constructor(props: Props): void{
    super();
    this.state = {
      project: props.project,
      volunteers: props.project && props.project.project_volunteers,
      showContactModal: false,
      showPositionModal: false,
      shownPosition: null,
      tabs: {
        details: true,
        skills: false,
        activity: false,
      },
      maxActivity: 5
    };
    this.handleUpdateVolunteers = this.handleUpdateVolunteers.bind(this);
    this.handleShowMoreActivity = this.handleShowMoreActivity.bind(this);
 }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      project: nextProps.project,
      volunteers: nextProps.project.project_volunteers
    });
  }

  handleShowVolunteerModal(position: ?PositionInfo) {
    this.setState({
      showJoinModal: true,
      positionToJoin: position
    });
  }

  handleUpdateVolunteers(volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>) {
    this.setState({
      volunteers: volunteers
    });
  }

  handleShowMoreActivity() {
    this.setState({ maxActivity: this.state.maxActivity + 5 });
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
      activity: false,
    };

    tabs[tab] = true;
    this.setState({tabs});
  }

  render(): $React$Node {
    return this.state.project ? this._renderDetails() : <div>{this.state.loadStatusMsg}</div>
  }

  _renderDetails(): React$Node {
    const project = this.state.project;
    return (
      <div className='AboutProjects-root'>
        {this._renderHeader(project)}
        <div className="AboutProjects-infoColumn">

          <div className='AboutProjects-iconContainer'>
            <img className='AboutProjects-icon'src={project && project.project_thumbnail && project.project_thumbnail.publicUrl} />
          </div>

          <div className='AboutProjects-details'>
            <ProjectDetails projectLocation={project && ProjectAPIUtils.getLocationDisplayName(project)}
            projectUrl={project && project.project_url}
            projectStage={project && !_.isEmpty(project.project_stage) ? project.project_stage[0].display_name : null}
            projectOrganizationType={project && !_.isEmpty(project.project_organization_type) ? project.project_organization_type[0].display_name : null}
            dateModified={project && project.project_date_modified}/>
          </div>

          {project && !_.isEmpty(project.project_links) &&
            <React.Fragment>
              <div className='AboutProjects-links'>
                <h4>Links</h4>
                {this._renderLinks()}
              </div>

            </React.Fragment>
          }

          { project && !_.isEmpty(project.project_files) &&
            <React.Fragment>
              <div className='AboutProjects-files'>
                <h4>Files</h4>
                  {this._renderFiles()}
              </div>

            </React.Fragment>
          }

          {project && !_.isEmpty(project.project_groups) &&
            <React.Fragment>
              <div className='AboutProjects-groups'>
                <h4>Groups</h4>
                <ul>
                  {
                    project.project_groups.map((group, i) => {
                      return <li key={i}><a href={url.section(Section.AboutGroup, {id: group.group_id})}>{group.group_name}</a></li>
                    })
                  }
                </ul>
              </div>

            </React.Fragment>
          }

          {/*TODO: Groups section*/}

          <div className='AboutProjects-team'>
            {
            !_.isEmpty(this.state.volunteers)
              ? <VolunteerSection
                  volunteers={this.state.volunteers}
                  isProjectAdmin={CurrentUser.userID() === project.project_creator}
                  isProjectCoOwner={CurrentUser.isCoOwner(project)}
                  projectId={project.project_id}
                  renderOnlyPending={true}
                  onUpdateVolunteers={this.handleUpdateVolunteers}
                />
              : null
            }
            <h4>Team</h4>
              {
                project && !_.isEmpty(project.project_owners)
                ? <ProjectOwnersSection
                  owners={project.project_owners}
                  />
                : null
              }

              {
              !_.isEmpty(this.state.volunteers)
                ? <VolunteerSection
                    volunteers={this.state.volunteers}
                    isProjectAdmin={CurrentUser.userID() === project.project_creator}
                    isProjectCoOwner={CurrentUser.isCoOwner(project)}
                    projectId={project.project_id}
                    renderOnlyPending={false}
                    onUpdateVolunteers={this.handleUpdateVolunteers}
                  />
                : null
              }
          </div>

        </div>

        <div className="AboutProjects-mainColumn">

          <div className='AboutProjects-intro'>
            <div className='AboutProjects-introTop'>
              <div className='AboutProjects-description'>
                <h1>{project && project.project_name}</h1>
                <p className='AboutProjects-description-issue'>{project && project.project_issue_area && project.project_issue_area.map(issue => issue.display_name).join(',')}</p>
                <p>{project && project.project_short_description}</p>
                <ApproveGroupsSection project={this.props.project}/>
              </div>

              <ProjectVolunteerModal
                projectId={this.state.project && this.state.project.project_id}
                positions={this.state.project && this.state.project.project_positions}
                positionToJoin={this.state.positionToJoin}
                showModal={this.state.showJoinModal}
                handleClose={this.confirmJoinProject.bind(this)}
              />

              {!this.props.viewOnly && this._renderContactAndVolunteerButtons()}

            </div>

            <div className="AboutProjects_tabs">

              <a onClick={() => this.changeHighlighted('details')} className={this.state.tabs.details ? 'AboutProjects_aHighlighted' : 'none'}href="#project-details">Details</a>

              {project && !_.isEmpty(project.project_positions) &&
              <a onClick={() => this.changeHighlighted('skills')} className={this.state.tabs.skills ? 'AboutProjects_aHighlighted' : 'none'} href="#positions-available">Skills Needed</a>
              }

              {project && !_.isEmpty(project.project_commits) &&
              <a onClick={() => this.changeHighlighted('activity')} className={this.state.tabs.activity ? 'AboutProjects_aHighlighted' : 'none'} href="#recent-activity">Recent Activity</a>
              }

            </div>
          </div>

          <div className='AboutProjects-details AboutProjects-details-description'>
            <div className="position-relative"><a className="position-absolute AboutProjects-jumplink" id="project-details" name="project-details"></a></div>
            <div>
              {project.project_description}
              {!_.isEmpty(project.project_description_solution) &&
                <React.Fragment>
                  <div>
                    <br></br>
                    {project.project_description_solution}
                  </div>
                </React.Fragment>
              }
              {!_.isEmpty(project.project_description_actions) &&
                <React.Fragment>
                  <div>
                    <br></br>
                    {project.project_description_actions}
                  </div>
                </React.Fragment>
              }
            </div>

            <div className='AboutProjects-skills-container'>

              {project && !_.isEmpty(project.project_positions) &&
                <div className='AboutProjects-skills'>
                  <p id='skills-needed' className='AboutProjects-skills-title'>Skills Needed</p>
                  {project && project.project_positions && project.project_positions.map(position => <p>{position.roleTag.display_name}</p>)}
                </div>
              }

              {project && !_.isEmpty(project.project_technologies) &&
                <div className='AboutProjects-technologies'>
                  <p className='AboutProjects-tech-title'>Technologies Used</p>
                  {project && project.project_technologies && project.project_technologies.map(tech => <p>{tech.display_name}</p>)}
                </div>
              }

            </div>
          </div>

          <div className='AboutProjects-positions-available'>
            <div className="position-relative">
              <a name="positions-available" id="positions-available" className="position-absolute AboutProjects-jumplink"></a>
            </div>
            <div>
              {project && !_.isEmpty(project.project_positions) && this._renderPositions()}
            </div>
          </div>

          {project && !_.isEmpty(project.project_commits) &&
            <div className='AboutProjects-recent-activity'>
              <div id="recent-activity">
                <h4>Recent Activity</h4>
                { project.project_commits
                    .slice(0, this.state.maxActivity)
                    .map(commit => <ProjectCommitCard commit={commit} />)
                }
                { project.project_commits.length > this.state.maxActivity && (

                  <div className="AboutProjects-show-more-activity-container">
                    <div className="btn btn-primary AboutProjects-show-more-activity"
                      onClick={this.handleShowMoreActivity}
                    >
                      Show more activity
                    </div>
                  </div>
                )}
              </div>
            </div>
          }

        </div>

      </div>
    )
  }

  _renderHeader(project: ProjectDetailsAPIData): React$Node {
    const title: string = project.project_name + " | DemocracyLab";
    const description: string = project.project_short_description || Truncate.stringT(project.project_description, 300);

    return (
      <Headers
        title={title}
        description={description}
        thumbnailUrl={project.project_thumbnail && project.project_thumbnail.publicUrl}
      />
    );
  }

  _renderContactAndVolunteerButtons(): React$Node {
    return (
      <div className='AboutProjects-owner'>
        <ContactProjectButton project={this.state.project}/>
        <ContactVolunteersButton project={this.state.project}/>
        <InviteProjectToGroupButton project={this.state.project}/>
        <ProjectVolunteerButton
          project={this.state.project}
          onVolunteerClick={this.handleShowVolunteerModal.bind(this)}
        />
      </div>
    );
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
    const linkOrder = [LinkTypes.CODE_REPOSITORY, LinkTypes.FILE_REPOSITORY, LinkTypes.MESSAGING, LinkTypes.PROJECT_MANAGEMENT];
    const sortedLinks = project && project.project_links && Sort.byNamedEntries(project.project_links, linkOrder, (link) => link.linkName);
    return sortedLinks.map((link, i) =>
      <IconLinkDisplay key={i} link={link}/>
    );
  }

  _renderPositions(): ?Array<React$Node> {
    const project: ProjectDetailsAPIData = this.state.project;
    const canApply: boolean = CurrentUser.canVolunteerForProject(project);
    return project && project.project_positions && _.chain(project.project_positions).sortBy(['roleTag.subcategory', 'roleTag.display_name']).value()
      .map((position, i) => {
        return <AboutPositionEntry
          key={i}
          project={project}
          position={position}
          onClickApply={canApply ? this.handleShowVolunteerModal.bind(this, position) : null}
        />;
      });
    }
}

export default AboutProjectDisplay;
