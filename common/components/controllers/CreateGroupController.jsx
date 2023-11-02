// @flow

import React from "react";
import CurrentUser from "../../components/utils/CurrentUser.js";
import Section from "../enums/Section.js";
import LogInController from "./LogInController.jsx";
import VerifyEmailBlurb from "../common/notification/VerifyEmailBlurb.jsx";
import GroupOverviewForm from "../componentsBySection/CreateGroup/GroupOverviewForm.jsx";
import GroupPreviewForm from "../componentsBySection/CreateGroup/GroupPreviewForm.jsx";
import GroupResourcesForm from "../componentsBySection/CreateGroup/GroupResourcesForm.jsx";
import GroupAPIUtils, { GroupDetailsAPIData } from "../utils/GroupAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {
  FormWorkflowStepConfig,
} from "../forms/FormWorkflow.jsx";
import type { APIResponse } from "../utils/api.js";

type State = {|
  groupId: ?number,
  group: ?GroupDetailsAPIData,
  steps: $ReadOnlyArray<FormWorkflowStepConfig>,
|};

/**
 * Encapsulates form for creating Groups

 */
class CreateGroupController extends React.PureComponent<{||}, State> {
  constructor(props: {||}): void {
    super(props);
    const groupId: number = url.argument("id");
    this.onNextPageSuccess = this.onNextPageSuccess.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFinalSubmitSuccess = this.onFinalSubmitSuccess.bind(this);
    this.state = {
      groupId: groupId,
      steps: [
        {
          header: "Let's get started!",
          subHeader: "Tell us how you want to create a better world.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: GroupOverviewForm,
        },
        {
          header: "What resources would you like to share?",
          subHeader: "Let volunteers know how they can engage with your group",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: GroupResourcesForm,
        },
        {
          header: "Ready to publish your group?",
          subHeader:
            "Congratulations!  You have successfully created a tech-for-good group.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onFinalSubmitSuccess,
          formComponent: GroupPreviewForm,
        },
      ],
    };
  }

  componentDidMount(): void {
    if (this.state.groupId) {
      GroupAPIUtils.fetchGroupDetails(
        this.state.groupId,
        this.loadGroupDetails.bind(this),
        this.handleLoadGroupError.bind(this)
      );
    }
    // if(CurrentUser.isLoggedIn() && CurrentUser.isEmailVerified()) {
    //   // Only fire event on initial page when the Group is not yet created
    //   if(!url.argument("id")) {
    //     metrics.logGroupClickCreate(CurrentUser.userID());
    //   }
    // }
  }

  updatePageUrl() {
    if (this.state.groupId && !url.argument("id")) {
      url.updateArgs({ id: this.state.groupId });
    }
    utils.navigateToTopOfPage();
  }

  loadGroupDetails(group: GroupDetailsAPIData): void {
    if (CurrentUser.isGroupOwner(group) || CurrentUser.isStaff()) {
      this.setState({
        group: group,
        groupIsLoading: false,
      });
    }
  }

  handleLoadGroupError(error: APIError): void {
    this.setState({
      error: "Failed to load Group information",
    });
  }

  onSubmit(
    event: SyntheticEvent<HTMLFormElement>,
    formRef: HTMLFormElement,
    onSubmitSuccess: (GroupDetailsAPIData, () => void) => void
  ): void {
    const formSubmitUrl: string =
      this.state.group && this.state.group.group_id
        ? "/api/groups/edit/" + this.state.group.group_id + "/"
        : "/api/groups/create/";
    api.postForm(
      formSubmitUrl,
      formRef,
      (response: APIResponse) => onSubmitSuccess(JSON.parse(response)),
      response => null /* TODO: Report error to user */
    );
  }

  onNextPageSuccess(group: GroupDetailsAPIData): void {
    this.setState({
      group: group,
      groupId: group.group_id,
    });
    this.updatePageUrl();
  }

  onFinalSubmitSuccess(group: GroupDetailsAPIData): void {
    // metrics.logGroupCreated(CurrentUser.userID());
    // TODO: Fix bug with switching to this section without page reload
    window.location.href = url.section(Section.MyGroups, {
      groupAwaitingApproval: url.encodeNameForUrlPassing(group.group_name),
    });
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <div className="form-body">
          {!CurrentUser.isLoggedIn() ? (
            <LogInController prevPage={Section.CreateGroup} />
          ) : (
            <React.Fragment>
              {CurrentUser.isEmailVerified() ? (
                <FormWorkflow
                  steps={this.state.steps}
                  isLoading={this.state.groupId && !this.state.group}
                  formFields={this.state.group}
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

export default CreateGroupController;
