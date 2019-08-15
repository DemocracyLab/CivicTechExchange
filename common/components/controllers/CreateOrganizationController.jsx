// @flow

import React from "react";
import CurrentUser from "../../components/utils/CurrentUser.js";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import Headers from "../common/Headers.jsx";
import OrganizationOverviewForm from "../componentsBySection/CreateOrganization/OrganizationOverviewForm.jsx";
import OrganizationInfoForm from "../componentsBySection/CreateOrganization/OrganizationInfoForm.jsx";
import OrganizationPreviewForm from "../componentsBySection/CreateOrganization/OrganizationPreviewForm.jsx";
import OrganizationDescriptionForm from "../componentsBySection/CreateOrganization/OrganizationDescriptionForm.jsx";
import OrganizationPositionsForm from "../componentsBySection/CreateOrganization/OrganizationPositionsForm.jsx";
import OrganizationResourcesForm from "../componentsBySection/CreateOrganization/OrganizationResourcesForm.jsx";
import OrganizationAPIUtils, {OrganizationDetailsAPIData} from "../utils/OrganizationAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {FormWorkflowStepConfig} from "../forms/FormWorkflow.jsx";

type State = {|
  id: ?number,
  organization: ?OrganizationDetailsAPIData,
  steps: $ReadOnlyArray<FormWorkflowStepConfig>
|};

/**
 * Encapsulates form for creating Organizations
 */
class CreateOrganizationController extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
    const organizationId: number = url.argument("id");
    this.onNextPageSuccess = this.onNextPageSuccess.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFinalSubmitSuccess = this.onFinalSubmitSuccess.bind(this);
    this.state = {
      organizationId: organizationId,
      steps: [
        {
          header: "Let's get started!",
          subHeader: "Tell us how you want to create a better world.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          // formComponent: () => <h1>Hello w2orld!</h1>,
          formComponent: OrganizationOverviewForm
        }, {
          header: "Let others know what your Organization is about...",
          subHeader: "You can always change details about your Organization later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: OrganizationInfoForm
        }, {
          header: "Let others know what your Organization is about...",
          subHeader: "You can always change details about your Organization later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: OrganizationDescriptionForm
        }, {
          header: "What resources would you like to share?",
          subHeader: "Let volunteers know how they can engage with your Organization",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: OrganizationResourcesForm
        }, {
          header: "What type of volunteers does your Organization need?",
          subHeader: "You can always change the type of help your Organization needs later.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: OrganizationPositionsForm
        }, {
          header: "Ready to publish your Organization?",
          subHeader: "Congratulations!  You have successfully created a tech-for-good Organization.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onFinalSubmitSuccess,
          formComponent: OrganizationPreviewForm
        }
      ]
    };
  }
  
  componentDidMount(): void {
    if(this.state.organizationId) {
      OrganizationAPIUtils.fetchOrganizationDetails(this.state.organizationId, this.loadOrganizationDetails.bind(this), this.handleLoadOrganizationError.bind(this));
    }
    // if(CurrentUser.isLoggedIn() && CurrentUser.isEmailVerified()) {
    //   // Only fire event on initial page when the Organization is not yet created
    //   if(!url.argument("id")) {
    //     metrics.logOrganizationClickCreate(CurrentUser.userID());
    //   }
    // }
  }

  updatePageUrl() {
    if(this.state.organizationId && !url.argument('id')) {
      url.updateArgs({id: this.state.organizationId});
    }
    utils.navigateToTopOfPage();
  }
  
  loadOrganizationDetails(organization: OrganizationDetailsAPIData): void {
    if(!CurrentUser.isOwner(organization)) {
      // TODO: Handle someone other than owner
    } else {
      this.setState({
        organization: organization,
        organizationIsLoading: false
      });
    }
  }
  
  handleLoadOrganizationError(error: APIError): void {
    this.setState({
      error: "Failed to load Organization information"
    });
  }
  
  onSubmit(event: SyntheticEvent<HTMLFormElement>, formRef: HTMLFormElement, onSubmitSuccess: (OrganizationDetailsAPIData, () => void) => void): void {
    const formSubmitUrl: string = this.state.organization && this.state.Organization.Organization_id
      ? "/organizations/edit/" + this.state.organization.Organization_id + "/"
      : "/organizations/signup/";
    api.postForm(formSubmitUrl, formRef, onSubmitSuccess, response => null /* TODO: Report error to user */);
  }
  
  onNextPageSuccess(organization: OrganizationDetailsAPIData): void {
    this.setState({
      organization: organization,
      organizationId: organization.organization_id
    });
    this.updatePageUrl();
  }
  
  onFinalSubmitSuccess(organization: OrganizationDetailsAPIData): void {
    metrics.logOrganizationCreated(CurrentUser.userID());
    // TODO: Fix bug with switching to this section without page reload
    window.location.href = url.section(Section.MyOrganizations, {OrganizationAwaitingApproval: organization.organization_name});
  }
  
  render(): React$Node {
    
    return (
      <React.Fragment>
        <Headers
          title="Create an Organization | DemocracyLab"
          description="Create organization page"
        />
        
        <div className="form-body">
          <FormWorkflow
                      steps={this.state.steps}
                      isLoading={this.state.organizationId && !this.state.organization}
                      formFields={this.state.organization}
                    />
          {/* {!CurrentUser.isLoggedIn()
            ? <LogInController prevPage={Section.CreateOrganization}/>
            : <React.Fragment>
                {CurrentUser.isEmailVerified()
                  ? (
                    <FormWorkflow
                      steps={this.state.steps}
                      isLoading={this.state.organizationId && !this.state.organization}
                      formFields={this.state.organization}
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

export default CreateOrganizationController;
