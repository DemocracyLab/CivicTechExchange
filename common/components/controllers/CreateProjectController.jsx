// @flow

import React from "react";
import CurrentUser from "../../components/utils/CurrentUser.js";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import Headers from "../common/Headers.jsx";
import ProjectOverviewForm from "../componentsBySection/CreateProject/ProjectOverviewForm.jsx";
import ProjectInfoForm from "../componentsBySection/CreateProject/ProjectInfoForm.jsx";
import ProjectPreviewForm from "../componentsBySection/CreateProject/ProjectPreviewForm.jsx";
import ProjectDescriptionForm from "../componentsBySection/CreateProject/ProjectDescriptionForm.jsx";
import ProjectPositionsForm from "../componentsBySection/CreateProject/ProjectPositionsForm.jsx";
import ProjectResourcesForm from "../componentsBySection/CreateProject/ProjectResourcesForm.jsx";
import ProjectAPIUtils, {ProjectDetailsAPIData} from "../utils/ProjectAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {FormWorkflowStepConfig} from "../forms/FormWorkflow.jsx";
import VerifyEmailBlurb from "../common/notification/VerifyEmailBlurb.jsx";


type State = {|
  projectId: ?number,
  project: ?ProjectDetailsAPIData,
  steps: $ReadOnlyArray<FormWorkflowStepConfig>
|};

/**
 * Encapsulates form for creating projects
 */
class CreateProjectController extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
    const projectId: number = url.argument("id");
    this.onNextPageSuccess = this.onNextPageSuccess.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFinalSubmitSuccess = this.onFinalSubmitSuccess.bind(this);
    this.state = {
      projectId: projectId,
      steps: [
        {
          header: "Let's get started!",
          subHeader: "Tell us how you want to create a better world.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectOverviewForm
        }, {
          header: "Let others know what your project is about...",
          subHeader: "You can always change details about your project later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectInfoForm
        }, {
          header: "Let others know what your project is about...",
          subHeader: "You can always change details about your project later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectDescriptionForm
        }, {
          header: "What resources would you like to share?",
          subHeader: "Let volunteers know how they can engage with your project",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectResourcesForm
        }, {
          header: "What type of volunteers does your project need?",
          subHeader: "You can always change the type of help your project needs later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectPositionsForm
        }, {
          header: "Ready to publish your project?",
          subHeader: "Congratulations!  You have successfully created a tech-for-good project.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onFinalSubmitSuccess,
          formComponent: ProjectPreviewForm
        }
      ]
    };
  }

  componentDidMount(): void {
    if(this.state.projectId) {
      ProjectAPIUtils.fetchProjectDetails(this.state.projectId, this.loadProjectDetails.bind(this), this.handleLoadProjectError.bind(this));
    }
    if(CurrentUser.isLoggedIn() && CurrentUser.isEmailVerified()) {
      // Only fire event on initial page when the project is not yet created
      if(!url.argument("id")) {
        metrics.logProjectClickCreate(CurrentUser.userID());
      }
    }
  }
  updatePageUrl() {
    if(this.state.projectId && !url.argument('id')) {
      url.updateArgs({id: this.state.projectId});
    }
    utils.navigateToTopOfPage();
  }

  loadProjectDetails(project: ProjectDetailsAPIData): void {
    if(!CurrentUser.isOwner(project)) {
      // TODO: Handle someone other than owner
    } else {
      this.setState({
        project: project,
        projectIsLoading: false
      });
    }
  }

  handleLoadProjectError(error: APIError): void {
    this.setState({
      error: "Failed to load project information"
    });
  }

  onSubmit(event: SyntheticEvent<HTMLFormElement>, formRef: HTMLFormElement, onSubmitSuccess: (ProjectDetailsAPIData, () => void) => void): void {
    const formSubmitUrl: string = this.state.project && this.state.project.project_id
      ? "/projects/edit/" + this.state.project.project_id + "/"
      : "/projects/signup/";
    api.postForm(formSubmitUrl, formRef, onSubmitSuccess, response => null /* TODO: Report error to user */);
  }

  onNextPageSuccess(project: ProjectDetailsAPIData): void {
    this.setState({
      project: project,
      projectId: project.project_id
    });
    this.updatePageUrl();
  }

  onFinalSubmitSuccess(project: ProjectDetailsAPIData): void {
    metrics.logProjectCreated(CurrentUser.userID());
    // TODO: Fix bug with switching to this section without page reload
    window.location.href = url.section(Section.MyProjects, {projectAwaitingApproval: project.project_name});
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <Headers
          title="Create a Project | DemocracyLab"
          description="Create project page"
        />
        <div className="form-body">
          {!CurrentUser.isLoggedIn()
            ? <LogInController prevPage={Section.CreateProject}/>
            : <React.Fragment>
                {CurrentUser.isEmailVerified()
                  ? (
                    <FormWorkflow
                      steps={this.state.steps}
                      isLoading={this.state.projectId && !this.state.project}
                      formFields={this.state.project}
                    />
                  )
                  : <VerifyEmailBlurb/>}
              </React.Fragment>
          }
        </div>
      </React.Fragment>
    );
  }

}

export default CreateProjectController;
