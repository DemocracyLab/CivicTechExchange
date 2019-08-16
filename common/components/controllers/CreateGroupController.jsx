// @flow

import React from "react";
import CurrentUser from "../../components/utils/CurrentUser.js";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import Headers from "../common/Headers.jsx";

import GroupOverviewForm from "../componentsBySection/CreateGroup/GroupOverviewForm.jsx";
import GroupPreviewForm from "../componentsBySection/CreateGroup/GroupPreviewForm.jsx";
import GroupProjectSelectionForm from "../componentsBySection/CreateGroup/GroupProjectSelectionForm.jsx";
import GroupResourcesForm from "../componentsBySection/CreateGroup/GroupResourcesForm.jsx";
import GroupAPIUtils, {GroupDetailsAPIData} from "../utils/GroupAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import FormWorkflow, {FormWorkflowStepConfig} from "../forms/FormWorkflow.jsx";
import ProjectSearchDispatcher from '../stores/ProjectSearchDispatcher.js';
import TagDispatcher from '../stores/TagDispatcher.js';
import ProjectCardsContainer from '../componentsBySection/FindProjects/ProjectCardsContainer.jsx';
import ProjectFilterContainer from '../componentsBySection/FindProjects/Filters/ProjectFilterContainer.jsx';
import {FindProjectsArgs} from "../stores/ProjectSearchStore.js";
import urls from "../utils/url.js";

let projectSelectionStoreSingleton = [

];

export { projectSelectionStoreSingleton };

type State = {|
  id: ?number,
  group: ?GroupDetailsAPIData,
  steps: $ReadOnlyArray<FormWorkflowStepConfig>
|};

/**
 * Encapsulates form for creating Groups

 */
class CreateGroupController extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
    const groupId: number = url.argument("id");
    this.onNextPageSuccess = this.onNextPageSuccess.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onProjectSelectionSubmit = this.onProjectSelectionSubmit.bind(this);
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
        }, {
          header: "What resources would you like to share?",
          subHeader: "Let volunteers know how they can engage with your group",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: GroupResourcesForm,
        }, {
          // TODO: bring in widget from common/components/controllers/FindProjectsController.jsx
          header: "Which projects are in your group?",
          subHeader: "You can always change details about your group later.",
          onSubmit: this.onProjectSelectionSubmit,
          onSubmitSuccess: this.onNextPageSuccess,
          formComponent: GroupProjectSelectionForm,
        }, {
          header: "Ready to publish your group?",
          subHeader: "Congratulations!  You have successfully created a tech-for-good group.",
          onSubmit: this.onSubmit,
          onSubmitSuccess: this.onFinalSubmitSuccess,
          formComponent: GroupPreviewForm,
        }
      ]
    };
  }

  componentWillMount(): void {
    let args: FindProjectsArgs = urls.arguments(document.location.search);
    args = _.pick(args, ['showSplash','keyword','sortField','location','page','issues','tech', 'role', 'org', 'stage']);
    ProjectSearchDispatcher.dispatch({type: 'INIT', findProjectsArgs: !_.isEmpty(args) ? args : null});
    TagDispatcher.dispatch({type: 'INIT'});
  }
  
  componentDidMount(): void {
    if(this.state.groupId) {
      GroupAPIUtils.fetchGroupDetails(this.state.groupId, this.loadGroupDetails.bind(this), this.handleLoadGroupError.bind(this));
    }
    // if(CurrentUser.isLoggedIn() && CurrentUser.isEmailVerified()) {
    //   // Only fire event on initial page when the Group is not yet created
    //   if(!url.argument("id")) {
    //     metrics.logGroupClickCreate(CurrentUser.userID());
    //   }
    // }
  }

  updatePageUrl() {
    if(this.state.groupId && !url.argument('id')) {
      url.updateArgs({id: this.state.groupId});
    }
    utils.navigateToTopOfPage();
  }
  
  loadGroupDetails(group: GroupDetailsAPIData): void {
    if(!CurrentUser.isOwner(group)) {
      // TODO: Handle someone other than owner
    } else {
      this.setState({
        group: group,
        groupIsLoading: false
      });
    }
  }
  
  handleLoadGroupError(error: APIError): void {
    this.setState({
      error: "Failed to load Group information"
    });
  }

  onProjectSelectionSubmit(event: SyntheticEvent<HTMLFormElement>, formRef: HTMLFormElement, onSubmitSuccess: (GroupDetailsAPIData, () => void) => void): void {
    console.warn('on submit!!2', event, formRef);
    
    api.post(
      "/groups/" + this.state.group.group_id + "/add_project/", 
      { project_ids: projectSelectionStoreSingleton.map(project => project.id) },
      (group) => {
        console.log('hello?')
        this.onNextPageSuccess(group)
      }, 
      response => null /* TODO: Report error to user */
    )
    // this.onSubmitSuccess()
    this.onNextPageSuccess(this.state.group)
  }
  
  onSubmit(event: SyntheticEvent<HTMLFormElement>, formRef: HTMLFormElement, onSubmitSuccess: (GroupDetailsAPIData, () => void) => void): void {
    console.log('on submit!!', event, formRef)
    const formSubmitUrl: string = this.state.group && this.state.group.group_id
      ? "/groups/edit/" + this.state.group.group_id + "/"
      : "/groups/create/";
    api.postForm(formSubmitUrl, formRef, onSubmitSuccess, response => null /* TODO: Report error to user */);
  }
  
  onNextPageSuccess(group: GroupDetailsAPIData): void {
    this.setState({
      group: group,
      groupId: group.group_id
    });
    this.updatePageUrl();
  }
  
  onFinalSubmitSuccess(group: GroupDetailsAPIData): void {
    // metrics.logGroupCreated(CurrentUser.userID());
    // TODO: Fix bug with switching to this section without page reload
    window.location.href = url.section(Section.MyGroups, {GroupAwaitingApproval: group.group_name});
  }
  
  render(): React$Node {
    
    return (
      <React.Fragment>
        <Headers
          title="Create an group | DemocracyLab"
          description="Create group page"
        />
        
        <div className="form-body">
          <FormWorkflow
            steps={this.state.steps}
            isLoading={this.state.groupId && !this.state.group}
            formFields={this.state.group}
          />
          {/* {!CurrentUser.isLoggedIn()
            ? <LogInController prevPage={Section.CreateGroup}/>
            : <React.Fragment>
                {CurrentUser.isEmailVerified()
                  ? (
                    <FormWorkflow
                      steps={this.state.steps}
                      isLoading={this.state.groupId && !this.state.group}
                      formFields={this.state.group}
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

export default CreateGroupController;
