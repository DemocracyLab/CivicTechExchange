// @flow

import React from 'react';
import EditProjectForm from '../common/projects/EditProjectForm.jsx'

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
      projectId:  (new RegExp("id=([^&]+)")).exec(document.location.search)[1]
    }
  }
  
  logProjectEdited() {
    window.FB.AppEvents.logEvent('projectEdited');
  }
  
  render(): React$Node {
    return (
      <div className="wrapper-gray">
        <div className="container">
          <form action={"/projects/signup/" + this.state.projectId + "/"} onSubmit={this.logProjectEdited} method="post">
            <EditProjectForm projectId={this.state.projectId}/>
          </form>
        </div>
      </div>
    );
  }
}

export default EditProjectController;
