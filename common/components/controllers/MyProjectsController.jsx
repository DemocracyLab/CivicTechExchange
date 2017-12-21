// @flow

import React from 'react';

class MyProjectsController extends React.PureComponent<{||}> {

  render(): React$Node {
    return (
      <div>
        <div>
          My Projects | Applications
        </div>
        <div>
          PROJECTS YOU OWN
        </div>
          [project card]
        <div>
        </div>
          PROJECTS YOU ARE VOLUNTEERING ON
        <div>
        </div>
          [project card]
        <div>
          [project card]
        </div>
        <div>
          [project card]
        </div>
      </div>
    );
  }
}

export default MyProjectsController;
