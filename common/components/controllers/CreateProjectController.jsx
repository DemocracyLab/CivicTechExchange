// @flow

import React from "react";
import _ from "lodash";
import CurrentUser from "../../components/utils/CurrentUser.js";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import ProjectOverviewForm from "../componentsBySection/CreateProject/ProjectOverviewForm.jsx";
import ProjectInfoForm from "../componentsBySection/CreateProject/ProjectInfoForm.jsx";
import ProjectPreviewForm from "../componentsBySection/CreateProject/ProjectPreviewForm.jsx";
import ProjectDescriptionForm from "../componentsBySection/CreateProject/ProjectDescriptionForm.jsx";
import ProjectPositionsForm from "../componentsBySection/CreateProject/ProjectPositionsForm.jsx";
import ProjectResourcesForm from "../componentsBySection/CreateProject/ProjectResourcesForm.jsx";
import ProjectAPIUtils, {
  ProjectDetailsAPIData,
} from "../utils/ProjectAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {
  FormWorkflowStepConfig,
} from "../forms/FormWorkflow.jsx";
import VerifyEmailBlurb from "../common/notification/VerifyEmailBlurb.jsx";
import type { Dictionary } from "../types/Generics.jsx";
import type { APIResponse } from "../utils/api.js";

type State = {|
  projectId: ?number,
  project: ?ProjectDetailsAPIData,
  steps: $ReadOnlyArray<FormWorkflowStepConfig>,
  startStep: ?number,
|};

/**
 * Encapsulates form for creating projects
 */
class CreateProjectController extends React.PureComponent<{||}, State> {
  constructor(props: {||}): void {
    super(props);
    const projectId: number = url.argument("id");
    this.onNextPageSuccess = this.onNextPageSuccess.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFinalSubmitSuccess = this.onFinalSubmitSuccess.bind(this);
    this.state = {
      projectId: projectId,
      startStep: 0,
      steps: [
        {
          header: "Let's get started!",
          subHeader: "Tell us how you want to create a better world.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectOverviewForm,
        },
        {
          header: "Let others know what your project is about...",
          subHeader: "You can always change details about your project later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectInfoForm,
        },
        {
          header: "Let others know what your project is about...",
          subHeader: "You can always change details about your project later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectDescriptionForm,
        },
        {
          header: "What resources would you like to share?",
          subHeader:
            "At DemocracyLab, we're all about transparency.  Share your project's internal collaboration resources and social media to help volunteers understand your goals and processes.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectResourcesForm,
        },
        {
          header: "What type of volunteers does your project need?",
          subHeader:
            "You can always change the type of help your project needs later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: ProjectPositionsForm,
        },
        {
          header: "Ready to submit your project?",
          subHeader:
            'Please review your project’s details and click "Submit" below when you’re ready.',
          submitButtonText: "Submit",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onFinalSubmitSuccess,
          formComponent: ProjectPreviewForm,
        },
      ],
    };
  }

  componentDidMount(): void {
    if (this.state.projectId) {
      ProjectAPIUtils.fetchProjectDetails(
        this.state.projectId,
        true,
        this.loadProjectDetails.bind(this),
        this.handleLoadProjectError.bind(this)
      );
    }
    if (CurrentUser.isLoggedIn() && CurrentUser.isEmailVerified()) {
      // Only fire event on initial page when the project is not yet created
      if (!url.argument("id")) {
        metrics.logProjectClickCreate(CurrentUser.userID());
      }
    }
  }
  updatePageUrl() {
    if (this.state.projectId && !url.argument("id")) {
      url.updateArgs({ id: this.state.projectId });
    }
    utils.navigateToTopOfPage();
  }

  loadProjectDetails(project: ProjectDetailsAPIData): void {
    if (!CurrentUser.isCoOwnerOrOwner(project) && !CurrentUser.isStaff()) {
      // TODO: Handle someone other than owner
    } else {
      if (project.project_created) {
        const lastStep: FormWorkflowStepConfig = _.last(this.state.steps);
        lastStep.header = "Ready to save your edits?";
        lastStep.subHeader =
          'When everything looks good, click "Update Project" below.';
        lastStep.submitButtonText = "Update Project";
      }
      this.setState({
        project: project,
        projectIsLoading: false,
        startStep: url.argument("step") || 1,
        steps: _.clone(this.state.steps),
      });
    }
  }

  handleLoadProjectError(error: APIError): void {
    this.setState({
      error: "Failed to load project information",
    });
  }

  onSubmit(
    event: SyntheticEvent<HTMLFormElement>,
    formRef: HTMLFormElement,
    onSubmitSuccess: ProjectDetailsAPIData => void
  ): void {
    const formSubmitUrl: string =
      this.state.project && this.state.project.project_id
        ? "/api/projects/edit/" + this.state.project.project_id + "/"
        : "/api/projects/create/";
    api.postForm(
      formSubmitUrl,
      formRef,
      (response: APIResponse) => onSubmitSuccess(JSON.parse(response)),
      response => null /* TODO: Report error to user */
    );
  }

  onNextPageSuccess(project: ProjectDetailsAPIData): void {
    this.setState(
      {
        project: project,
        projectId: project.project_id,
      },
      this.updatePageUrl.bind(this)
    );
  }

  onFinalSubmitSuccess(project: ProjectDetailsAPIData): void {
    this.setState({
      project: project,
      projectId: project.project_id,
    });
    metrics.logProjectCreated(CurrentUser.userID());
    // TODO: Fix bug with switching to this section without page reload
    let urlArgs: Dictionary<string> = {
      projectAwaitingApproval: url.encodeNameForUrlPassing(
        project.project_name
      ),
    };
    if (project.event_created_from) {
      // Show modal on next page for prompting to create event project
      urlArgs = Object.assign(urlArgs, {
        fromProjectId: project.project_id,
        fromEventId: project.event_created_from,
      });
    }
    if(!project.project_approved){
      window.location.href = url.section(Section.MyProjects, urlArgs);
    } else {
      window.location.href = url.section(Section.MyProjects, null);

    }
   
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <div className="form-body">
          {!CurrentUser.isLoggedIn() ? (
            <LogInController prevPage={Section.CreateProject} />
          ) : (
            <React.Fragment>
              {CurrentUser.isEmailVerified() ? (
                <FormWorkflow
                  steps={this.state.steps}
                  startStep={this.state.startStep}
                  isLoading={this.state.projectId && !this.state.project}
                  formFields={this.state.project}
                />
              ) : (
                <VerifyEmailBlurb />
              )}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default CreateProjectController;
