// @flow

import React from "react";
import Section from "../enums/Section.js";
import EventOverviewForm from "../componentsBySection/CreateEvent/EventOverviewForm.jsx";
import EventPreviewForm from "../componentsBySection/CreateEvent/EventPreviewForm.jsx";
import EventDescriptionForm from "../componentsBySection/CreateEvent/EventDescriptionForm.jsx";
import EventAPIUtils, { EventData } from "../utils/EventAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {
  FormWorkflowStepConfig,
} from "../forms/FormWorkflow.jsx";
import CurrentUser from "../utils/CurrentUser";
import LogInController from "./LogInController.jsx";
import VerifyEmailBlurb from "../common/notification/VerifyEmailBlurb.jsx";
import type { APIResponse } from "../utils/api.js";

type State = {|
  eventId: ?number,
  event: ?EventData,
  steps: $ReadOnlyArray<FormWorkflowStepConfig>,
|};

/**
 * Encapsulates form for creating Events
 */
class CreateEventController extends React.PureComponent<{||}, State> {
  constructor(props: {||}): void {
    super(props);
    const eventId: number = url.argument("id");
    this.onNextPageSuccess = this.onNextPageSuccess.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFinalSubmitSuccess = this.onFinalSubmitSuccess.bind(this);
    this.state = {
      eventId: eventId,
      steps: [
        {
          header: "Let's get started!",
          subHeader: "",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: EventOverviewForm,
        },
        {
          header: "Let others know what your Event is about...",
          subHeader: "You can always change details about your Event later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: EventDescriptionForm,
        },
        {
          header: "Ready to publish your Event?",
          subHeader:
            "Congratulations!  You have successfully created a tech-for-good Event.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onFinalSubmitSuccess,
          formComponent: EventPreviewForm,
        },
      ],
    };
  }

  componentDidMount(): void {
    if (this.state.eventId) {
      EventAPIUtils.fetchEventDetails(
        this.state.eventId,
        this.loadEventDetails.bind(this),
        this.handleLoadEventError.bind(this)
      );
    }
  }

  updatePageUrl() {
    if (this.state.eventId && !url.argument("id")) {
      url.updateArgs({ id: this.state.eventId });
    }
    utils.navigateToTopOfPage();
  }

  loadEventDetails(event: EventData): void {
    if (!EventAPIUtils.isOwner(event) && !CurrentUser.isStaff()) {
      // TODO: Handle someone other than owner/admin
    } else {
      this.setState({
        event: event,
        eventIsLoading: false,
      });
    }
  }

  handleLoadEventError(error: APIError): void {
    this.setState({
      error: "Failed to load Event information",
    });
  }

  onSubmit(
    event: SyntheticEvent<HTMLFormElement>,
    formRef: HTMLFormElement,
    onSubmitSuccess: (EventData, () => void) => void
  ): void {
    const formSubmitUrl: string =
      this.state.event && this.state.event.event_id
        ? "/api/events/edit/" + this.state.event.event_id + "/"
        : "/api/events/create/";
    api.postForm(
      formSubmitUrl,
      formRef,
      (response: APIResponse) => onSubmitSuccess(JSON.parse(response)),
      response => null /* TODO: Report error to user */
    );
  }

  onNextPageSuccess(event: EventData): void {
    this.setState({
      event: event,
      eventId: event.event_id,
    });
    this.updatePageUrl();
  }

  onFinalSubmitSuccess(event: EventData): void {

    if(!event.event_approved){
      window.location.href = url.section(Section.AboutEvent, {
        id: event.event_id,
        eventAwaitingApproval: url.encodeNameForUrlPassing(event.event_name),
      });
    } else {
      window.location.href = url.section(Section.AboutEvent, null);
    }
  
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <div className="form-body">
          {!CurrentUser.isLoggedIn() ? (
            <LogInController prevPage={Section.CreateEvent} />
          ) : (
            <React.Fragment>
              {CurrentUser.isEmailVerified() ? (
                <FormWorkflow
                  steps={this.state.steps}
                  isLoading={this.state.eventId && !this.state.event}
                  formFields={this.state.event}
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

export default CreateEventController;
