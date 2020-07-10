// @flow

import React from "react";
import Section from "../enums/Section.js";
import Headers from "../common/Headers.jsx";
import EventOverviewForm from "../componentsBySection/CreateEvent/EventOverviewForm.jsx";
import EventPreviewForm from "../componentsBySection/CreateEvent/EventPreviewForm.jsx";
import EventDescriptionForm from "../componentsBySection/CreateEvent/EventDescriptionForm.jsx";
import EventAPIUtils, {EventData} from "../utils/EventAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {FormWorkflowStepConfig} from "../forms/FormWorkflow.jsx";

type State = {|
  id: ?number,
  Event: ?EventData,
  steps: $ReadOnlyArray<FormWorkflowStepConfig>
|};

/**
 * Encapsulates form for creating Events
 */
class CreateEventController extends React.PureComponent<{||},State> {
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
          formComponent: EventOverviewForm
        }, {
          header: "Let others know what your Event is about...",
          subHeader: "You can always change details about your Event later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: EventDescriptionForm
        }, {
          header: "Ready to publish your Event?",
          subHeader: "Congratulations!  You have successfully created a tech-for-good Event.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onFinalSubmitSuccess,
          formComponent: EventPreviewForm
        }
      ]
    };
  }
  
  componentDidMount(): void {
    if(this.state.eventId) {
      EventAPIUtils.fetchEventDetails(this.state.eventId, this.loadEventDetails.bind(this), this.handleLoadEventError.bind(this));
    }
  }

  updatePageUrl() {
    if(this.state.eventId && !url.argument('id')) {
      url.updateArgs({id: this.state.eventId});
    }
    utils.navigateToTopOfPage();
  }
  
  loadEventDetails(event: EventData): void {
    if(!EventAPIUtils.isOwner(event)) {
      // TODO: Handle someone other than owner
    } else {
      this.setState({
        event: event,
        eventIsLoading: false
      });
    }
  }
  
  handleLoadEventError(error: APIError): void {
    this.setState({
      error: "Failed to load Event information"
    });
  }
  
  onSubmit(event: SyntheticEvent<HTMLFormElement>, formRef: HTMLFormElement, onSubmitSuccess: (EventData, () => void) => void): void {
    const formSubmitUrl: string = this.state.event && this.state.event.event_id
      ? "/events/edit/" + this.state.event.event_id + "/"
      : "/events/create/";
    api.postForm(formSubmitUrl, formRef, onSubmitSuccess, response => null /* TODO: Report error to user */);
  }
  
  onNextPageSuccess(event: EventData): void {
    this.setState({
      event: event,
      eventId: event.event_id
    });
    this.updatePageUrl();
  }
  
  onFinalSubmitSuccess(event: EventData): void {
    window.location.href = url.section(Section.AboutEvent, {id: event.event_id});
  }
  
  render(): React$Node {
    
    return (
      <React.Fragment>
        <Headers
          title="Create an Event | DemocracyLab"
          description="Create event page"
        />
        
        <div className="form-body">
          <FormWorkflow
                      steps={this.state.steps}
                      isLoading={this.state.eventId && !this.state.event}
                      formFields={this.state.event}
                    />
          {/* {!CurrentUser.isLoggedIn()
            ? <LogInController prevPage={Section.CreateEvent}/>
            : <React.Fragment>
                {CurrentUser.isEmailVerified()
                  ? (
                    <FormWorkflow
                      steps={this.state.steps}
                      isLoading={this.state.eventId && !this.state.event}
                      formFields={this.state.event}
                    />
                  )
                  : <VerifyEmailBlurb/>}
              </React.Fragment>
          } */}
        </div>
      </React.Fragment>
    );
  }
  
}

export default CreateEventController;
