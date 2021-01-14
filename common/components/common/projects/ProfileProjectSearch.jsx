// @flow

import React from "react";
import { EventData } from "../../utils/EventAPIUtils.js";
import ProjectFilterDataContainer from "../../componentsBySection/FindProjects/Filters/ProjectFilterDataContainer.jsx";
import ResetSearchButton from "../../componentsBySection/FindProjects/ResetSearchButton.jsx";
import ProjectSearchBar from "../../componentsBySection/FindProjects/ProjectSearchBar.jsx";
import ProjectCardsContainer from "../../componentsBySection/FindProjects/ProjectCardsContainer.jsx";
import ProjectSearchSort from "../../componentsBySection/FindProjects/ProjectSearchSort.jsx";
import ProjectTagContainer from "../../componentsBySection/FindProjects/ProjectTagContainer.jsx";

type Props = {|
  event: ?EventData,
  viewOnly: boolean,
|};

type State = {|
  event: ?EventData,
|};

class ProfileProjectSearch extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
  }

  render(): ?$React$Node {
    return (
      <React.Fragment>
        <ProjectSearchBar />
        <ResetSearchButton />
        {/*TODO: Put ProjectTagContainer and ProjectFilterDataContainer in a collapsible container*/}
        <ProjectTagContainer />
        <ProjectFilterDataContainer title="Filter by" />
        <ProjectSearchSort />
        <div className="row">
          <ProjectCardsContainer
            showSearchControls={false}
            staticHeaderText="Participating Projects"
            fullWidth={true}
            selectableCards={false}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default ProfileProjectSearch;
