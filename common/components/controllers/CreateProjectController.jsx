// @flow

import React from 'react';
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
          <form action="/projects/signup/" onSubmit={this.logProjectCreated} method="post">
            <EditProjectForm/>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateProjectController;
