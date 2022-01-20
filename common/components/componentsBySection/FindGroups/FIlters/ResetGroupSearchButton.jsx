// @flow
import type { ReduceStore } from "flux/utils";
import { List } from "immutable";
import { Container } from "flux/utils";
import GroupSearchStore from "../../../stores/GroupSearchStore.js";
import GroupSearchDispatcher from "../../../stores/GroupSearchDispatcher.js";
import type { LocationRadius } from "../../stores/ProjectSearchStore.js";
import React from "react";
import _ from "lodash";

type State = {|
  keyword: string,
  tags: List<TagDefinition>,
  sortField: string,
  locationRadius: LocationRadius,
|};

class ResetGroupSearchButton extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<ReduceStore> {
    return [GroupSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: GroupSearchStore.getKeyword() || "",
      tags: GroupSearchStore.getSelectedTags() || [],
      sortField: GroupSearchStore.getSortField() || "",
      locationRadius: GroupSearchStore.getLocation() || {},
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
    GroupSearchDispatcher.dispatch({
      type: "CLEAR_FILTERS",
    });
  }
}

export default Container.create(ResetGroupSearchButton);
