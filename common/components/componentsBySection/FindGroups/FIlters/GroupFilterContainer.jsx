// @flow
import React from "react";
import GroupFilterDataContainer from "./GroupFilterDataContainer.jsx";
import ResetSearchButton from "../../FindProjects/ResetSearchButton.jsx";

class GroupFilterContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root col-12 col-md-4 col-lg-3 pl-0 pr-0">
        <div className="ProjectFilterContainer-reset">
          <ResetSearchButton />
        </div>
        <GroupFilterDataContainer />
      </div>
    );
  }
}

export default GroupFilterContainer;
