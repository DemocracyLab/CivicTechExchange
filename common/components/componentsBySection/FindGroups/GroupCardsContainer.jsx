// @flow

import React from "react";
import type { ReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import { List } from "immutable";
import GroupCard from "./GroupCard.jsx";
import EntitySearchStore from "../../stores/EntitySearchStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import EntitySearchSort from "../../common/search/EntitySearchSort.jsx";
import EntityTagContainer from "../../common/search/EntityTagContainer.jsx";
import LoadingFrame from "../../chrome/LoadingFrame.jsx";
import type { LocationRadius } from "../../common/location/LocationRadius.js";
import { Dictionary, createDictionary } from "../../types/Generics.jsx";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import type { GroupTileAPIData } from "../../utils/GroupAPIUtils.js";
import utils from "../../utils/utils.js";
import _ from "lodash";

type Props = {|
  showSearchControls: ?boolean,
  staticHeaderText: ?string,
|};

type State = {|
  groups: List<GroupTileAPIData>,
  group_pages: number,
  current_page: number,
  group_count: number,
  location: LocationRadius,
  tagDictionary: Dictionary<TagDefinition>,
|};

class GroupCardsContainer extends React.Component<Props, State> {
  static getStores(): $ReadOnlyArray<ReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      groups: EntitySearchStore.getEntities(),
      group_pages: EntitySearchStore.getEntityPages(),
      group_count: EntitySearchStore.getNumberOfEntities(),
      current_page: EntitySearchStore.getCurrentPage(),
      groups_loading: EntitySearchStore.isLoading(),
      keyword: EntitySearchStore.getKeyword() || "",
      tags: EntitySearchStore.getTags() || [],
      location: EntitySearchStore.getLocation() || "",
      tagDictionary: EntitySearchStore.getAllTags() || [],
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col">
        {this.props.showSearchControls ? (
          <React.Fragment>
            <EntitySearchSort />
            <EntityTagContainer />
          </React.Fragment>
        ) : null}
        <div className="row">
          {!_.isEmpty(this.state.groups) && (
            <h3 className="ProjectCardContainer-header">
              {this._renderCardHeaderText()}
            </h3>
          )}
          {this._renderCards()}
        </div>
        <div>{this._renderPagination()}</div>
      </div>
    );
  }

  _renderCardHeaderText(): React$Node {
    if (this.props.staticHeaderText) {
      return this.props.staticHeaderText;
    } else if (
      this.state.keyword ||
      this.state.tags.size > 0 ||
      (this.state.location &&
        this.state.location.latitude &&
        this.state.location.longitude)
    ) {
      return (
        this.state.group_count +
        " " +
        utils.pluralize("group", "groups", this.state.group_count) +
        " found"
      );
    } else {
      return "Find groups that match your interests";
    }
  }

  _renderCards(): React$Node {
    return !this.state.groups ? (
      <LoadingFrame height="80vh" />
    ) : this.state.groups.size === 0 ? (
      "No Groups match the provided criteria. Try a different set of filters or search term."
    ) : (
      this.state.groups.map((group: GroupTileAPIData, index: number) => (
        <div className="col-sm-12 col-lg-6">
          <GroupCard
            group={group}
            key={index}
            maxTextLength={140}
            maxIssuesCount={4}
            tagDictionary={this.state.tagDictionary}
          />
        </div>
      ))
    );
  }

  _handleFetchNextPage(e: object): void {
    e.preventDefault();

    const nextPage =
      this.state.current_page + 1 <= this.state.group_pages
        ? this.state.current_page + 1
        : this.state.current_page;

    this.setState({ current_page: nextPage }, function() {
      UniversalDispatcher.dispatch({
        type: "SET_PAGE",
        page: this.state.current_page,
      });
    });
  }

  _renderPagination(): ?React$Node {
    if (
      this.state.current_page === this.state.group_pages &&
      !this.state.groups_loading
    ) {
      return null;
    }
    if (!_.isEmpty(this.state.groups) && this.state.groups_loading) {
      return (
        <div className="page_selection_footer">
          <button className="btn btn-primary disabled">Loading...</button>
        </div>
      );
    }
    return this.state.groups && this.state.groups.size !== 0 ? (
      <div className="page_selection_footer">
        <button
          className="btn btn-primary"
          onClick={this._handleFetchNextPage.bind(this)}
        >
          More Groups...
        </button>
      </div>
    ) : null;
  }
}

export default Container.create(GroupCardsContainer);
