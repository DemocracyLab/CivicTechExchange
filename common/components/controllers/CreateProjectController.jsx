// @flow

import React from 'react';
import CurrentUser from '../../components/utils/CurrentUser.js';
import EditProjectForm from "../common/projects/EditProjectForm.jsx";
import VerifyEmailBlurb from "../common/notification/VerifyEmailBlurb.jsx";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import Headers from "../common/Headers.jsx";


type State = {|
  showEmailConfirmationModal: boolean,
  emailConfirmationError: boolean
|};

/**
 * Encapsulates form for creating projects
 */
class CreateProjectController extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
    
    this.state = {
      showEmailConfirmationModal: false,
      emailConfirmationError: false
    };
  }
  
  componentDidMount(): void {
    if(CurrentUser.isLoggedIn() && CurrentUser.isEmailVerified()) {
      metrics.logProjectClickCreate(CurrentUser.userID());
    }
  }
  
  logProjectCreated(): void {
    metrics.logProjectCreated(CurrentUser.userID());
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
    return (
      <form action="/projects/signup/" onSubmit={this.logProjectCreated} method="post">
        <EditProjectForm/>
      </form>
    );
  }
}

export default CreateProjectController;
