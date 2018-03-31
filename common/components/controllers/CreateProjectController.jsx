// @flow

import React from 'react';
import CurrentUser from '../../components/utils/CurrentUser.js';
import EditProjectForm from '../common/projects/EditProjectForm.jsx'

/**
 * Encapsulates form for creating projects
 */
class CreateProjectController extends React.PureComponent<{||},{||}> {
  constructor(props: {||}): void {
    super(props);
  }
  
  logProjectCreated() {
    window.FB.AppEvents.logEvent('projectCreated');
  }
  
  render(): React$Node {
    return (
      <div className="wrapper-gray">
        <div className="container">
          {CurrentUser.isEmailVerified() ? this._renderCreateProjectForm() : this._renderEmailNotVerifiedMessage()}
        </div>
      </div>
    );
  }
  
  _renderCreateProjectForm() : React$Node {
    return (
      <form action="/projects/signup/" onSubmit={this.logProjectCreated} method="post">
        <EditProjectForm/>
      </form>
    );
  }
  
  _renderEmailNotVerifiedMessage() : React$Node {
    return (
      <div>
        You have not verified your email address yet.  Please check your email inbox and click on the supplied link.
      </div>
    );
  }
}

export default CreateProjectController;
