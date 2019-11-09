// @flow

import React from 'react';
import _ from 'lodash'
import apiHelper from "../../utils/api.js";
import type {ProjectDetailsAPIData} from '../../utils/ProjectAPIUtils.js';
import ProjectDetails from '../../componentsBySection/FindProjects/ProjectDetails.jsx';
import ContactProjectButton from "./ContactProjectButton.jsx";
import ContactVolunteersButton from "./ContactVolunteersButton.jsx";
import ProjectVolunteerButton from "./ProjectVolunteerButton.jsx";
import ProjectVolunteerModal from "./ProjectVolunteerModal.jsx";
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
import DropdownMenu from "react-bootstrap/es/DropdownMenu";


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
  tabs: object
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
      }
    };

    this.handleUpdateVolunteers = this.handleUpdateVolunteers.bind(this);
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
            <ProjectDetails projectLocation={project && project.project_location}
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

          {project && !_.isEmpty(project.project_organization) &&
            <React.Fragment>
              <div className='AboutProjects-communities'>
                <h4>Communities</h4>
                <ul>
                  {
                    project.project_organization.map((org, i) => {
                      return <li key={i}>{org.display_name}</li>
                    })
                  }
                </ul>
              </div>

            </React.Fragment>
          }

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

            </div>
          </div>

          <div className='AboutProjects-details'>
            <div id='project-details'>
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
            <div id="positions-available">
              {project && !_.isEmpty(project.project_positions) && this._renderPositions()}
            </div>
          </div>


            <div className='AboutProjects-commit-history'>
              <h5>Commit Activity</h5>
              <div id="commit-history">
              {project && !_.isEmpty(project.project_links) &&
                this._renderCommitHistory()
              }
              </div>
            </div>

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

  _renderCommitHistory(): ?Array<React$Node>{
    const project: ProjectDetailsAPIData = this.state.project;
    const links = project.project_links;
    const githubUrl = "https://github.com/";
    const githubAPIUrl = "https://api.github.com/repos/";

    let sampleCommits = 
      [
        {
          "url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
          "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
          "node_id": "MDY6Q29tbWl0NmRjYjA5YjViNTc4NzVmMzM0ZjYxYWViZWQ2OTVlMmU0MTkzZGI1ZQ==",
          "html_url": "https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e",
          "comments_url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments",
          "commit": {
            "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
            "author": {
              "name": "Monalisa Octocat",
              "email": "support@github.com",
              "date": "2011-04-14T16:00:49Z"
            },
            "committer": {
              "name": "Monalisa Octocat",
              "email": "support@github.com",
              "date": "2011-04-15T12:00:49Z"
            },
            "message": "Added new API call",
            "tree": {
              "url": "https://api.github.com/repos/octocat/Hello-World/tree/6dcb09b5b57875f334f61aebed695e2e4193db5e",
              "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e"
            },
            "comment_count": 0,
            "verification": {
              "verified": false,
              "reason": "unsigned",
              "signature": null,
              "payload": null
            }
          },
          "author": {
            "login": "octocat",
            "id": 1,
            "node_id": "MDQ6VXNlcjE=",
            "avatar_url": "https://github.com/images/error/octocat_happy.gif",
            "gravatar_id": "",
            "url": "https://api.github.com/users/octocat",
            "html_url": "https://github.com/octocat",
            "followers_url": "https://api.github.com/users/octocat/followers",
            "following_url": "https://api.github.com/users/octocat/following{/other_user}",
            "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
            "organizations_url": "https://api.github.com/users/octocat/orgs",
            "repos_url": "https://api.github.com/users/octocat/repos",
            "events_url": "https://api.github.com/users/octocat/events{/privacy}",
            "received_events_url": "https://api.github.com/users/octocat/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "octocat",
            "id": 1,
            "node_id": "MDQ6VXNlcjE=",
            "avatar_url": "https://github.com/images/error/octocat_happy.gif",
            "gravatar_id": "",
            "url": "https://api.github.com/users/octocat",
            "html_url": "https://github.com/octocat",
            "followers_url": "https://api.github.com/users/octocat/followers",
            "following_url": "https://api.github.com/users/octocat/following{/other_user}",
            "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
            "organizations_url": "https://api.github.com/users/octocat/orgs",
            "repos_url": "https://api.github.com/users/octocat/repos",
            "events_url": "https://api.github.com/users/octocat/events{/privacy}",
            "received_events_url": "https://api.github.com/users/octocat/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
              "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e"
            }
          ]
        },
        {
          "url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
          "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
          "node_id": "MDY6Q29tbWl0NmRjYjA5YjViNTc4NzVmMzM0ZjYxYWViZWQ2OTVlMmU0MTkzZGI1ZQ==",
          "html_url": "https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e",
          "comments_url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments",
          "commit": {
            "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
            "author": {
              "name": "Monalisa Octocat",
              "email": "support@github.com",
              "date": "2011-04-14T16:00:49Z"
            },
            "committer": {
              "name": "Monalisa Octocat",
              "email": "support@github.com",
              "date": "2011-04-14T16:00:49Z"
            },
            "message": "Fix all the bugs",
            "tree": {
              "url": "https://api.github.com/repos/octocat/Hello-World/tree/6dcb09b5b57875f334f61aebed695e2e4193db5e",
              "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e"
            },
            "comment_count": 0,
            "verification": {
              "verified": false,
              "reason": "unsigned",
              "signature": null,
              "payload": null
            }
          },
          "author": {
            "login": "octocat",
            "id": 1,
            "node_id": "MDQ6VXNlcjE=",
            "avatar_url": "https://github.com/images/error/octocat_happy.gif",
            "gravatar_id": "",
            "url": "https://api.github.com/users/octocat",
            "html_url": "https://github.com/octocat",
            "followers_url": "https://api.github.com/users/octocat/followers",
            "following_url": "https://api.github.com/users/octocat/following{/other_user}",
            "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
            "organizations_url": "https://api.github.com/users/octocat/orgs",
            "repos_url": "https://api.github.com/users/octocat/repos",
            "events_url": "https://api.github.com/users/octocat/events{/privacy}",
            "received_events_url": "https://api.github.com/users/octocat/received_events",
            "type": "User",
            "site_admin": false
          },
          "committer": {
            "login": "octocat",
            "id": 1,
            "node_id": "MDQ6VXNlcjE=",
            "avatar_url": "https://github.com/images/error/octocat_happy.gif",
            "gravatar_id": "",
            "url": "https://api.github.com/users/octocat",
            "html_url": "https://github.com/octocat",
            "followers_url": "https://api.github.com/users/octocat/followers",
            "following_url": "https://api.github.com/users/octocat/following{/other_user}",
            "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
            "organizations_url": "https://api.github.com/users/octocat/orgs",
            "repos_url": "https://api.github.com/users/octocat/repos",
            "events_url": "https://api.github.com/users/octocat/events{/privacy}",
            "received_events_url": "https://api.github.com/users/octocat/received_events",
            "type": "User",
            "site_admin": false
          },
          "parents": [
            {
              "url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
              "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e"
            }
          ]
        }
      ];

      let githubLink = "";

      links.forEach(function(link){
        if(link.linkUrl.includes(githubUrl)){
          githubLink = link.linkUrl;
        }
      });
      
        let stringAfterGithub = githubLink.slice(githubUrl.length, githubLink.length);
        let indexOfFirstBackslash = stringAfterGithub.indexOf("/");
        let username = stringAfterGithub.slice(0, indexOfFirstBackslash);
        let repoName = stringAfterGithub.slice(indexOfFirstBackslash,
         stringAfterGithub.length);

        let apiSetUp = githubAPIUrl + username + repoName + "/commits";

        let returnedElement;

        function successCallback(successResponse){
          console.log("Success");
          console.log(successResponse);
          return (successResponse.map((file, i) =>
            <div key={i}>
              <a href={file.html_url}>Commit {i+1}</a>
              <p>{file.commit.committer.date}</p>
              <p>{file.commit.message}</p>
            </div>));
        }

        function errorCallback(errorResponse){
          let succinctErrorResponse = {
            errorCode: errorResponse.status,
            errorMessage: JSON.stringify(errorResponse)
          }

          console.log("error");
          returnedElement = <p>This is not working</p>;
        }

        const headers = {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Origin': false
        };

        fetch(new Request(apiSetUp, { method: "GET", headers: headers }))
          .then(response => {
            if(!response.ok) {
              throw Error();
            }
            return response.json();
          })
          .then(responsePayload => successCallback && successCallback(responsePayload))
          .catch(response => errorCallback(response));

        // TODO: Add get method if need be
        //apiHelper.get(apiSetUp, "{}",
        //(successResponse) => ,
        //(errorResponse) => {
        //    console.log("Error");
        //    console.log(errorResponse);
        //    return (<div><p>This is working</p></div>);
        //})

        let commitDetails = [];

        function addZero(dateValue){
          if(dateValue < 10){
            return "0"+dateValue;
          }

          return dateValue;
        }

        sampleCommits.forEach(function(commit) {
          let commitDetailsOneCommit = {};

          commitDetailsOneCommit.htmlLink = commit.html_url;

          let formDate = new Date(commit.commit.committer.date);

          // Format info: codehandbook.org/javascript-date-format/
          commitDetailsOneCommit.date = commit.commit.committer.date;
          // commitDetailsOneCommit.readableDate = formDate.toString();
          commitDetailsOneCommit.readableDate = formDate.getFullYear() + "-" + addZero(formDate.getMonth()) + "-" + addZero(formDate.getDate()) + " " + addZero(formDate.getHours()) + ":" + addZero(formDate.getMinutes());
          commitDetailsOneCommit.message = commit.commit.message;

          commitDetails.push(commitDetailsOneCommit);
        });

        // TODO: Replace direct return with the values from the fetch method above
        return commitDetails.map((file, i) =>
            <div key={i}>
              <a href={file.htmlLink}>Commit {i+1}</a>
              <p>{file.readableDate}</p>
              <p>{file.message}</p>
            </div>);
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
