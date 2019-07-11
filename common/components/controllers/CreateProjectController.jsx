// @flow

import React from "react";
import CurrentUser from "../../components/utils/CurrentUser.js";
import VerifyEmailBlurb from "../common/notification/VerifyEmailBlurb.jsx";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import Headers from "../common/Headers.jsx";
import ProjectOverviewForm from "../componentsBySection/CreateProject/ProjectOverviewForm.jsx";
import ProjectInfoForm from "../componentsBySection/CreateProject/ProjectInfoForm.jsx";
import ProjectPreviewForm from "../componentsBySection/CreateProject/ProjectPreviewForm.jsx";
import {ProjectDetailsAPIData} from "../utils/ProjectAPIUtils.js";
import api from "../utils/api.js";
import url from "../utils/url.js";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";

type CreateProjectStepConfig = {|
  header: string,
  subHeader: string,
  formComponent: React$Node,
  prerequisites: (ProjectDetailsAPIData) => boolean
|};

const steps: $ReadOnlyArray<CreateProjectStepConfig> = [
  {
    header: "Let's get started!",
    subHeader: "Tell us how you want to create a better world.",
    formComponent: ProjectOverviewForm,
    prerequisites: (project: ProjectDetailsAPIData) => true
  }, {
    header: "Let others know what your project is about...",
    subHeader: "You can always change details about your project later.",
    formComponent: ProjectInfoForm,
    prerequisites: (project: ProjectDetailsAPIData) => project.project_name
  }, {
    header: "Let others know what your project is about...",
    subHeader: "You can always change details about your project later.",
    formComponent: ProjectPreviewForm,
    prerequisites: (project: ProjectDetailsAPIData) => project.project_name
  }, {
    header: "What resources would you like to share?",
    subHeader: "Let volunteers know how they can engage with your project",
    formComponent: ProjectPreviewForm,
    prerequisites: (project: ProjectDetailsAPIData) => project.project_name
  }, {
    header: "What type of volunteers does your project need?",
    subHeader: "You can always change the type of help your project needs later.",
    formComponent: ProjectPreviewForm,
    prerequisites: (project: ProjectDetailsAPIData) => project.project_name
  }, {
    header: "Ready to publish your project?",
    subHeader: "Congratulations!  You have successfully created a tech-for-good project.",
    formComponent: ProjectPreviewForm,
    prerequisites: (project: ProjectDetailsAPIData) => !!project
  }
];


type State = {|
  projectId: number,
  project: ?ProjectDetailsAPIData,
  currentStep: number,
  formIsValid: boolean
|};

/**
 * Encapsulates form for creating projects
 */
class CreateProjectController extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
    // TODO: Support navigating to page via &step=#
    // TODO: Support auto-navigating to page via prerequisites
    const projectId: number = url.argument("id");
    this.formRef = React.createRef();
    this.state = {
      projectId: projectId,
      currentStep: 0,
      formIsValid: false
    };
  }
  
  loadCurrentStep(projectId: ?number): CreateProjectStepConfig {
    // Load step by name if present
    // Load project if projectId
      // Advance to correct step if step name not specified
  }
  
  componentDidMount(): void {
    if(this.state.projectId) {
      ProjectAPIUtils.fetchProjectDetails(this.state.projectId, this.loadProjectDetails.bind(this), this.handleLoadProjectError.bind(this));
    }
    if(CurrentUser.isLoggedIn() && CurrentUser.isEmailVerified()) {
      // TODO: Only fire event on initial page when the project is not yet created
      // metrics.logProjectClickCreate(CurrentUser.userID());
    }
  }
  
  loadProjectDetails(project: ProjectDetailsAPIData): void {
    if(!CurrentUser.isOwner(project)) {
      // TODO: Handle someone other than owner
    } else {
      this.setState({project: project});
    }
  }
  
  handleLoadProjectError(error: APIError): void {
    this.setState({
      error: "Failed to load project information"
    });
  }
  
  onValidationCheck(formIsValid: boolean): void {
    if (formIsValid !== this.state.formIsValid) {
      this.setState({formIsValid});
    }
  }
  
  onSubmit(event: SyntheticEvent<HTMLFormElement>): void {
    const formSubmitUrl: string = this.state.project && this.state.project.project_id
      ? "/projects/edit/" + this.state.project.project_id + "/"
      : "/projects/signup/";
    api.postForm(formSubmitUrl, this.formRef, this.onSubmitSuccess.bind(this), response => null /* TODO: Report error to user */);
    event.preventDefault();
  }
  
  onSubmitSuccess(project: ProjectDetailsAPIData) {
    
    if(this.onLastStep()) {
      metrics.logProjectCreated(CurrentUser.userID());
      url.navigateToSection(Section.MyProjects);
    } else {
      this.setState({
        project: project,
        currentStep: this.state.currentStep + 1
      });
    }
  }
  
  render(): React$Node {
    return (
      <React.Fragment>
        <Headers
          title="Create a Project | DemocracyLab"
          description="Create project page"
        />
        {!CurrentUser.isLoggedIn()
          ? <LogInController prevPage={Section.CreateProject}/>
          : <div className="wrapper-gray">
            <div className="container">
              {CurrentUser.isEmailVerified() ? this._renderCreateProjectForm() : <VerifyEmailBlurb/>}
            </div>
          </div>
        }
      </React.Fragment>
    );
  }
  
  _renderCreateProjectForm() : React$Node {
    const currentStep: CreateProjectStepConfig = steps[this.state.currentStep];
    const FormComponent: React$Node = currentStep.formComponent;
    return (
      <React.Fragment>
        <h1>{currentStep.header}</h1>
        <h2>{currentStep.subHeader}</h2>
        {/*TODO: Show spinner when loading project*/}
        {/*TODO: Render step bars*/}
        <form
              onSubmit={this.onSubmit.bind(this)}
              method="post"
              ref={this.formRef}>
          <FormComponent
            project={this.state.project}
            readyForSubmit={this.onValidationCheck.bind(this)}
          />
    
          {/*TODO: Back button*/}
          {/*TODO: Project Saved icon*/}
          
          <div className="form-group pull-right">
            <div className='text-right'>
              <input type="submit" className="btn_outline save_btn"
                     disabled={!this.state.formIsValid}
                     value={this.onLastStep() ? "Publish" : "Next"}
              />
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
  
  onLastStep(): boolean {
    return this.state.currentStep >= steps.length;
  }
}

export default CreateProjectController;
