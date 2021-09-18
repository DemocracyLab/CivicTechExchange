// @flow

import CurrentUser from "../utils/CurrentUser.js";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";
import MyProjectCard from "../componentsBySection/MyProjects/MyProjectCard.jsx";
import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import metrics from "../utils/metrics.js";
import ProjectVolunteerRenewModal from "../common/projects/ProjectVolunteerRenewModal.jsx";
import ProjectVolunteerConcludeModal from "../common/projects/ProjectVolunteerConcludeModal.jsx";
import LogInController from "./LogInController.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section";
import React from "react";
import _ from "lodash";
import Headers from "../common/Headers.jsx";
import type { UserContext } from "../utils/CurrentUser.js";

type State = {|
  ownedProjects: ?Array<MyProjectData>,
  volunteeringProjects: ?Array<MyProjectData>,
  showConfirmDeleteModal: boolean,
  showRenewVolunteerModal: boolean,
  showConcludeVolunteerModal: boolean,
|};

class MyProjectsController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      ownedProjects: userContext.owned_projects,
      volunteeringProjects: userContext.volunteering_projects,
      showConfirmDeleteModal: false,
      showRenewVolunteerModal: false,
      showConcludeVolunteerModal: false,
    };
  }

  componentWillMount(): void {
    const args = url.arguments(window.location.href);
    if (
      "from" in args &&
      args.from === "renewal_notification_email" &&
      CurrentUser.isLoggedIn()
    ) {
      metrics.logVolunteerClickReviewCommitmentsInEmail(CurrentUser.userID());
    }
  }

  clickDeleteProject(project: MyProjectData): void {
    this.setState({
      showConfirmDeleteModal: true,
      projectToDelete: project,
    });
  }

  clickRenewVolunteerWithProject(project: MyProjectData): void {
    this.setState({
      showRenewVolunteerModal: true,
      applicationId: project.application_id,
    });
  }

  clickConcludeVolunteerWithProject(project: MyProjectData): void {
    this.setState({
      showConcludeVolunteerModal: true,
      applicationId: project.application_id,
    });
  }

  removeProjectFromList(): void {
    metrics.logProjectDeleted(
      CurrentUser.userID(),
      this.state.projectToDelete.project_id
    );
    this.setState({
      ownedProjects: _.pull(
        this.state.ownedProjects,
        this.state.projectToDelete
      ),
    });
    this.forceUpdate();
  }

  confirmDeleteProject(confirmedDelete: boolean): void {
    if (confirmedDelete) {
      const url =
        "/api/projects/delete/" + this.state.projectToDelete.project_id + "/";
      //TODO: this should be ProjectAPIUtils.delete, not post
      ProjectAPIUtils.post(
        url,
        {},
        // success callback
        this.removeProjectFromList.bind(this)
        //TODO: handle errors
      );
    }
    this.setState({
      showConfirmDeleteModal: false,
    });
  }

  confirmVolunteerRenew(renewed: boolean): void {
    if (renewed) {
      const project: MyProjectData = this.state.volunteeringProjects.find(
        (project: MyProjectData) =>
          project.application_id === this.state.applicationId
      );
      metrics.logVolunteerRenewed(CurrentUser.userID(), project.project_id);
      project.isUpForRenewal = false;
    }
    this.setState({
      showRenewVolunteerModal: false,
    });
    this.forceUpdate();
  }

  confirmVolunteerConclude(concluded: boolean): void {
    let newState = {
      showConcludeVolunteerModal: false,
    };
    if (concluded) {
      const project: MyProjectData = _.remove(
        this.state.volunteeringProjects,
        (project: MyProjectData) =>
          project.application_id === this.state.applicationId
      )[0];
      metrics.logVolunteerConcluded(CurrentUser.userID(), project.project_id);
    }
    this.setState(newState);
    this.forceUpdate();
  }

  render(): React$Node {
    // TODO: Move header to backend
    return CurrentUser.isLoggedIn() ? (
      <React.Fragment>
        <Headers
          title="My Projects | DemocracyLab"
          description="My Projects page"
        />
        <div className="MyProjectsController-root">
          <ConfirmationModal
            showModal={this.state.showConfirmDeleteModal}
            message="Are you sure you want to delete this project?"
            onSelection={this.confirmDeleteProject.bind(this)}
          />

          <ProjectVolunteerRenewModal
            showModal={this.state.showRenewVolunteerModal}
            applicationId={this.state.applicationId}
            handleClose={this.confirmVolunteerRenew.bind(this)}
          />

          <ProjectVolunteerConcludeModal
            showModal={this.state.showConcludeVolunteerModal}
            applicationId={this.state.applicationId}
            handleClose={this.confirmVolunteerConclude.bind(this)}
          />

          {!_.isEmpty(this.state.ownedProjects) &&
            this.renderProjectCollection(
              "Owned Projects",
              this.state.ownedProjects
            )}
          {!_.isEmpty(this.state.volunteeringProjects) &&
            this.renderProjectCollection(
              "Volunteering With",
              this.state.volunteeringProjects
            )}
        </div>
      </React.Fragment>
    ) : (
      <LogInController prevPage={Section.MyProjects} />
    );
  }

  renderProjectCollection(
    title: string,
    projects: $ReadOnlyArray<MyProjectData>
  ): React$Node {
    return (
      <div>
        <h3>{title}</h3>
        {projects.map(project => {
          return (
            <MyProjectCard
              key={project.project_name}
              project={project}
              onProjectClickDelete={this.clickDeleteProject.bind(this)}
              onProjectClickRenew={this.clickRenewVolunteerWithProject.bind(
                this
              )}
              onProjectClickConclude={this.clickConcludeVolunteerWithProject.bind(
                this
              )}
            />
          );
        })}
      </div>
    );
  }
}

export default MyProjectsController;
