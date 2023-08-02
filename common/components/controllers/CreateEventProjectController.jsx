// @flow

import React from "react";
import { Container } from "flux/utils";
import _ from "lodash";
import CurrentUser, {
  MyProjectData,
} from "../../components/utils/CurrentUser.js";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {
  FormWorkflowStepConfig,
} from "../forms/FormWorkflow.jsx";
import EventProjectAPIUtils, {
  EventProjectAPIDetails,
} from "../utils/EventProjectAPIUtils.js";
import CreateEventProjectSelect from "../componentsBySection/CreateEventProject/CreateEventProjectSelect.jsx";
import CreateEventProjectScope from "../componentsBySection/CreateEventProject/CreateEventProjectScope.jsx";
import FormFieldsStore from "../stores/FormFieldsStore.js";
import EventProjectResourcesForm from "../componentsBySection/CreateEventProject/EventProjectResourcesForm.jsx";
import EventProjectPositionsForm from "../componentsBySection/CreateEventProject/EventProjectPositionsForm.jsx";

type State = {|
  projectId: ?string,
  eventId: string,
  eventProject: ?EventProjectAPIDetails,
  steps: $ReadOnlyArray<FormWorkflowStepConfig>,
  startStep: ?number,
  isLoading: boolean,
  waitForLoad: boolean,
|};

/**
 * Encapsulates form for RSVP-ing projects for events
 */
class CreateEventProjectController extends React.Component<{||}, State> {
  constructor(props: {||}): void {
    super(props);
    const eventId: string = url.argument("event_id");
    const projectId: ?number = url.argument("project_id");
    this.onNextPageSuccess = this.onNextPageSuccess.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFinalSubmitSuccess = this.onFinalSubmitSuccess.bind(this);
    this.state = {
      eventId: eventId,
      projectId: projectId,
      waitForLoad: !!projectId,
      startStep: 0,
      steps: [
        {
          header: "Let's submit your project to the hackathon",
          subHeader: "",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: CreateEventProjectSelect,
        },
        {
          header:
            "Thank you for submitting your project for the hackathon! Now, let others know what you plan to work on at the event:",
          subHeader:
            "Share your internal resources to help volunteers understand your goals and processes. " +
            "Any changes below will not impact the details of your long-term project profile.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: CreateEventProjectScope,
        },
        {
          header: "What resources would you like to share?",
          subHeader:
            "Share your internal resources to help volunteers understand the goals and processes. " +
            "Any changes below will not impact the details of your long-term project profile.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: EventProjectResourcesForm,
        },
        {
          header: "What type of volunteers does your hackathon team need?",
          subHeader:
            "You can always change the type of help your team needs later. " +
            "Any changes below will not impact the details of your long-term project profile.",
          submitButtonText: "Submit",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onFinalSubmitSuccess,
          formComponent: EventProjectPositionsForm,
        },
      ],
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    const project: MyProjectData = FormFieldsStore.getFormFieldValue("project");
    if (project) {
      state.projectId = project?.project_id;
    }
    return state;
  }

  componentDidMount(): void {
    if (this.state.projectId) {
      this.setState(
        { isLoading: true },
        EventProjectAPIUtils.fetchEventProjectDetails(
          this.state.eventId,
          this.state.projectId,
          this.loadEventProjectDetails.bind(this),
          this.handleLoadProjectError.bind(this)
        )
      );
    }
  }
  updatePageUrl() {
    if (this.state.projectId && !url.argument("project_id")) {
      url.updateArgs({ project_id: this.state.projectId });
    }
    utils.navigateToTopOfPage();
  }

  loadEventProjectDetails(eventProject: EventProjectAPIDetails): void {
    if (!CurrentUser.isCoOwnerOrOwner(eventProject) && !CurrentUser.isStaff()) {
      // TODO: Handle someone other than owner
    } else {
      this.setState({
        eventProject: eventProject,
        startStep: url.argument("step") || 1,
        steps: _.clone(this.state.steps),
        isLoading: false,
      });
    }
  }

  handleLoadProjectError(error: APIError): void {
    this.setState({
      error: "Failed to load event project information",
      isLoading: false,
    });
  }

  onSubmit(
    event: SyntheticEvent<HTMLFormElement>,
    formRef: HTMLFormElement,
    onSubmitSuccess: (EventProjectAPIDetails, () => void) => void
  ): void {
    const formSubmitUrl: string = `/api/event/${this.state.eventId}/projects/${this.state.projectId}/create/`;
    api.postForm(
      formSubmitUrl,
      formRef,
      response => onSubmitSuccess(JSON.parse(response)),
      response => null /* TODO: Report error to user */
    );
  }

  onNextPageSuccess(eventProject: EventProjectAPIDetails): void {
    this.setState({
      eventProject: eventProject,
      projectId: eventProject.project_id,
    });
    this.updatePageUrl();
  }

  onFinalSubmitSuccess(eventProject: EventProjectAPIDetails): void {
    this.setState({
      eventProject: eventProject,
    });
    // metrics.logProjectCreated(CurrentUser.userID());
    window.location.href = url.section(Section.AboutEventProject, {
      event_id: eventProject.event_id,
      project_id: eventProject.project_id,
    });
  }

  render(): React$Node {
    const showForm: boolean =
      !this.state.waitForLoad || this.state.eventProject;
    return (
      <React.Fragment>
        <div className="form-body">
          {!CurrentUser.isLoggedIn() ? (
            <LogInController prevPage={Section.CreateEventProject} />
          ) : (
            <React.Fragment>
              {showForm && (
                <FormWorkflow
                  steps={this.state.steps}
                  startStep={this.state.startStep}
                  isLoading={this.state.isLoading}
                  formFields={this.state.eventProject}
                />
              )}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Container.create(CreateEventProjectController, {
  withProps: true,
});
