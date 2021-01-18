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
        <div className="row justify-content-center ProjectProfileSearch-root">
          <div className="col-12 col-lg-10">
            <h3 className="ProjectProfileSearch-sectiontitle pt-4">
              Search Participating Projects
            </h3>
            <ProjectSearchBar />
            <div className="d-flex justify-content-between pt-4 pb-2">
              <h3 className="ProjectProfileSearch-sectiontitle">Filter By</h3>
              <ResetSearchButton />
            </div>
            <CollapsiblePreviewPanel
              previewContent={tagContainer}
              collapsibleContent={filterContainer}
              expanded={false}
            />
          </div>
        </div>
        <div className="ProjectProfileSearch-sort row">
          <div className="col-12 pt-4 d-flex justify-content-end">
            <h4>Sort By</h4>
            <ProjectSearchSort />
          </div>
        </div>
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
