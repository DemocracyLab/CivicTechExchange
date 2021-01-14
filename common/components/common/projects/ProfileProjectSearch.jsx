// @flow

import React from "react";
import { EventData } from "../../utils/EventAPIUtils.js";
import ProjectFilterDataContainer from "../../componentsBySection/FindProjects/Filters/ProjectFilterDataContainer.jsx";
import ResetSearchButton from "../../componentsBySection/FindProjects/ResetSearchButton.jsx";
import ProjectSearchBar from "../../componentsBySection/FindProjects/ProjectSearchBar.jsx";
import ProjectCardsContainer from "../../componentsBySection/FindProjects/ProjectCardsContainer.jsx";
import ProjectSearchSort from "../../componentsBySection/FindProjects/ProjectSearchSort.jsx";
import ProjectTagContainer from "../../componentsBySection/FindProjects/ProjectTagContainer.jsx";
import CollapsiblePreviewPanel from "../CollapsiblePreviewPanel.jsx";

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
    const tagContainer: React$Node = <ProjectTagContainer />;
    const filterContainer: React$Node = (
      <ProjectFilterDataContainer title="Filter by" />
    );
    return (
      <React.Fragment>
        <ProjectSearchBar />
        <ResetSearchButton />
        <CollapsiblePreviewPanel
          previewContent={tagContainer}
          collapsibleContent={filterContainer}
          expanded={false}
        />
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
