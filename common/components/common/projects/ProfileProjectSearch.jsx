// @flow

import React from "react";
import ProjectFilterDataContainer from "../../componentsBySection/FindProjects/Filters/ProjectFilterDataContainer.jsx";
import ResetSearchButton from "../../componentsBySection/FindProjects/ResetSearchButton.jsx";
import EntitySearchBar from "../search/EntitySearchBar.jsx";
import ProjectCardsContainer from "../../componentsBySection/FindProjects/ProjectCardsContainer.jsx";
import EntitySearchSort from "../search/EntitySearchSort.jsx";
import EntityTagContainer from "../search/EntityTagContainer.jsx";
import CollapsiblePreviewPanel from "../CollapsiblePreviewPanel.jsx";

type Props = {|
  viewOnly: boolean,
  wide: boolean,
|};

type State = {|
  hidden: boolean,
|};

class ProfileProjectSearch extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      hidden: true,
    };
  }

  handleEmptyProject(): void {
    this.setState({
      hidden: false,
    });
  }

  render(): ?$React$Node {
    return this.state.hidden ? (
      <React.Fragment>
        {!this.props.viewOnly && this._renderSearchControls()}
        <div className="row">
          <ProjectCardsContainer
            showSearchControls={false}
            staticHeaderText="Participating Projects"
            fullWidth={true}
            selectableCards={false}
            // handleEmptyProject={this.handleEmptyProject.bind(this)}
          />
        </div>
      </React.Fragment>
    ) : null;
  }

  _renderSearchControls(): ?$React$Node {
    const tagContainer: React$Node = <EntityTagContainer />;
    const filterContainer: React$Node = (
      <ProjectFilterDataContainer title="Filter by" />
    );
    return (
      <React.Fragment>
        {" "}
        <div className="row justify-content-center ProjectProfileSearch-root">
          <div
            className={
              this.props.wide
                ? "col-12 col-md-10"
                : "col-12 col-md-10 col-lg-9 col-xl-8"
            }
          >
            <h3 className="ProjectProfileSearch-sectiontitle pt-4">
              Search Participating Projects
            </h3>
            <EntitySearchBar placeholder="Skill, keyword, or issue areas" />
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
            <EntitySearchSort hideSearch={true} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProfileProjectSearch;
