// @flow

import React from 'react';
import EditProjectForm from '../common/projects/EditProjectForm.jsx'
import url from '../utils/url.js'

type State = {|
  projectId: number
|};

/**
 * Encapsulates form for editing projects
 */
class EditProjectController extends React.PureComponent<{||},State> {
  constructor(props: Props): void {
    super(props);
  
    this.state = {
      projectId:  url.arguments(document.location.search).id
    }
  }
  
  logProjectEdited() {
    window.FB.AppEvents.logEvent('projectEdited');
  }
  
  render(): React$Node {
    return (
      <div className="wrapper-gray">
        <div className="container">
          <form action={`/projects/edit/${this.state.projectId}/`} onSubmit={this.logProjectEdited} method="post">
            <EditProjectForm projectId={this.state.projectId}/>
          </form>
        </div>
      </div>
    );
  }
}

export default EditProjectController;
