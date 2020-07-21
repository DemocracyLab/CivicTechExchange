
// @flow
import React from 'react';
import GroupFilterDataContainer from "./GroupFilterDataContainer.jsx";
import ResetGroupSearchButton from "./ResetGroupSearchButton.jsx";

class GroupFilterContainer extends React.PureComponent<{||}> {

  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root col-12 col-md-4 col-lg-3 pl-0 pr-0">
        <div className="ProjectFilterContainer-reset">
          <ResetGroupSearchButton />
        </div>
          <GroupFilterDataContainer />
      </div>
    );
  }
}

export default GroupFilterContainer;
