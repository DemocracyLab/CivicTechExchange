// @flow
import type { FluxReduceStore } from "flux/utils";
import { List } from "immutable";
import { Container } from "flux/utils";
import EntitySearchStore from "../../stores/EntitySearchStore.js";
import type { LocationRadius } from "../../common/location/LocationRadius.js";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
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
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: EntitySearchStore.getKeyword() || "",
      tags: EntitySearchStore.getTags() || [],
      defaultSort: EntitySearchStore.getDefaultSortField() || "",
      sortField: EntitySearchStore.getSortField() || "",
      location: EntitySearchStore.getLegacyLocation() || "",
      locationRadius: EntitySearchStore.getLocation() || {},
      favoritesOnly: EntitySearchStore.getFavoritesOnly(),
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
