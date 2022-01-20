// @flow
import type { ReduceStore } from "flux/utils";
import { List } from "immutable";
import { Container } from "flux/utils";
import EventSearchStore from "../../../stores/EventSearchStore.js";
import EventSearchDispatcher from "../../../stores/EventSearchDispatcher.js";
import type { LocationRadius } from "../../stores/ProjectSearchStore.js";
import React from "react";
import _ from "lodash";

type State = {|
  keyword: string,
  tags: List<TagDefinition>,
  sortField: string,
  locationRadius: LocationRadius,
|};

class ResetEventSearchButton extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<ReduceStore> {
    return [EventSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: EventSearchStore.getKeyword() || "",
      tags: EventSearchStore.getSelectedTags() || [],
      sortField: EventSearchStore.getSortField() || "",
      locationRadius: EventSearchStore.getLocation() || {},
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
              this.state.sortField ||
              !_.isEmpty(this.state.locationRadius)
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
    EventSearchDispatcher.dispatch({
      type: "CLEAR_FILTERS",
    });
  }
}

export default Container.create(ResetEventSearchButton);
