// @flow

import React from "react";
import ProjectFilterContainer from "../../componentsBySection/FindProjects/Filters/ProjectFilterContainer.jsx";
import ResetSearchButton from "../../componentsBySection/FindProjects/ResetSearchButton.jsx";
import ProjectSearchBar from "../../componentsBySection/FindProjects/ProjectSearchBar.jsx";
import ProjectCardsContainer from "../../componentsBySection/FindProjects/ProjectCardsContainer.jsx";
import ProjectSearchSort from "../../componentsBySection/FindProjects/ProjectSearchSort.jsx";
import ProjectTagContainer from "../../componentsBySection/FindProjects/ProjectTagContainer.jsx";
import CollapsiblePreviewPanel from "../CollapsiblePreviewPanel.jsx";

type Props = {|
  viewOnly: boolean,
  wide: boolean,
|};

class ProfileProjectSearch extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super();
  }

  render(): ?$React$Node {
    return (
      <React.Fragment>
        {!this.props.viewOnly && this._renderSearchControls()}
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

  _renderSearchControls(): ?$React$Node {
    const tagContainer: React$Node = <ProjectTagContainer />;
    const filterContainer: React$Node = (
      <ProjectFilterContainer title="Filter by" />
    );
    return (
      <React.Fragment>
        {" "}
        <div className="row justify-content-center ProjectProfileSearch-root">
          <div className={ this.props.wide ? "col-12 col-md-10" : "col-12 col-md-10 col-lg-9 col-xl-8"}> 
            <h3 className="ProjectProfileSearch-sectiontitle pt-4">
              Search Participating Projects
            </h3>
            <ProjectSearchBar placeholder="Skill, keyword, or issue areas" />
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
            <ProjectSearchSort hideSearch={true} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProfileProjectSearch;
