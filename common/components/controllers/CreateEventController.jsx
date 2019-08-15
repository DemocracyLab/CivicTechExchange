// @flow

import React from "react";
import CurrentUser from "../../components/utils/CurrentUser.js";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import Headers from "../common/Headers.jsx";
import EventOverviewForm from "../componentsBySection/CreateEvent/EventOverviewForm.jsx";
import EventPreviewForm from "../componentsBySection/CreateEvent/EventPreviewForm.jsx";
import EventDescriptionForm from "../componentsBySection/CreateEvent/EventDescriptionForm.jsx";
import EventPositionsForm from "../componentsBySection/CreateEvent/EventPositionsForm.jsx";
import EventResourcesForm from "../componentsBySection/CreateEvent/EventResourcesForm.jsx";
import EventAPIUtils, {EventDetailsAPIData} from "../utils/EventAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {FormWorkflowStepConfig} from "../forms/FormWorkflow.jsx";

type State = {|
  id: ?number,
  Event: ?EventDetailsAPIData,
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
          subHeader: "Tell us how you want to create a better world.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          // formComponent: () => <h1>Hello w2orld!</h1>,
          formComponent: EventOverviewForm
        }, {
          header: "Let others know what your Event is about...",
          subHeader: "You can always change details about your Event later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: EventDescriptionForm
        }, {
          header: "What resources would you like to share?",
          subHeader: "Let volunteers know how they can engage with your Event",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: EventResourcesForm
        }, {
          header: "What type of volunteers does your Event need?",
          subHeader: "You can always change the type of help your Event needs later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: EventPositionsForm
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
    // if(CurrentUser.isLoggedIn() && CurrentUser.isEmailVerified()) {
    //   // Only fire event on initial page when the Event is not yet created
    //   if(!url.argument("id")) {
    //     metrics.logEventClickCreate(CurrentUser.userID());
    //   }
    // }
  }

  updatePageUrl() {
    if(this.state.eventId && !url.argument('id')) {
      url.updateArgs({id: this.state.eventId});
    }
    utils.navigateToTopOfPage();
  }
  
  loadEventDetails(event: EventDetailsAPIData): void {
    if(!CurrentUser.isOwner(event)) {
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
  
  onSubmit(event: SyntheticEvent<HTMLFormElement>, formRef: HTMLFormElement, onSubmitSuccess: (EventDetailsAPIData, () => void) => void): void {
    const formSubmitUrl: string = this.state.event && this.state.event.event_id
      ? "/events/edit/" + this.state.event.event_id + "/"
      : "/events/signup/";
    api.postForm(formSubmitUrl, formRef, onSubmitSuccess, response => null /* TODO: Report error to user */);
  }
  
  onNextPageSuccess(event: EventDetailsAPIData): void {
    this.setState({
      event: event,
      eventId: event.event_id
    });
    this.updatePageUrl();
  }
  
  onFinalSubmitSuccess(event: EventDetailsAPIData): void {
    metrics.logEventCreated(CurrentUser.userID());
    // TODO: Fix bug with switching to this section without page reload
    window.location.href = url.section(Section.MyEvents, {EventAwaitingApproval: event.event_name});
  }
  
  render(): React$Node {
    
    return (
      <React.Fragment>
        <Headers
          title="Create an Event | DemocracyLab"
          description="Create event page"
        />
        
        <div className="form-body">
        <h1>sup fam</h1>
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
