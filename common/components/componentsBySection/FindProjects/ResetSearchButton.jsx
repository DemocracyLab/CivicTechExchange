// @flow
import type { FluxReduceStore } from "flux/utils";
import { List } from "immutable";
import { Container } from "flux/utils";
import ProjectSearchStore from "../../stores/ProjectSearchStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { LocationRadius } from "../../stores/ProjectSearchStore.js";
import React from "react";
import _ from "lodash";

type State = {|
  keyword: string,
  tags: List<TagDefinition>,
  defaultSort: string,
  sortField: string,
  location: string,
  locationRadius: LocationRadius,
  favoritesOnly: boolean,
|};

class ResetSearchButton extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: ProjectSearchStore.getKeyword() || "",
      tags: ProjectSearchStore.getTags() || [],
      defaultSort: ProjectSearchStore.getDefaultSortField() || "",
      sortField: ProjectSearchStore.getSortField() || "",
      location: ProjectSearchStore.getLegacyLocation() || "",
      locationRadius: ProjectSearchStore.getLocation() || {},
      favoritesOnly: ProjectSearchStore.getFavoritesOnly(),
    };
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <button
          className="btn btn-primary btn-block reset-search-button"
          disabled={
            !(
              this.state.keyword ||
              this.state.tags.size > 0 ||
              this.state.sortField !== this.state.defaultSort ||
              this.state.location ||
              !_.isEmpty(this.state.locationRadius) ||
              this.state.favoritesOnly
            )
          }
          onClick={this._clearFilters.bind(this)}
        >
          Clear Filters
        </button>
      </React.Fragment>
    );
  }
  _clearFilters(): void {
    UniversalDispatcher.dispatch({
      type: "CLEAR_FILTERS",
    });
  }
}

export default Container.create(ResetSearchButton);
