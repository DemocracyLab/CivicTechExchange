// @flow
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import React from "react";
import Select from "react-select";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { SelectOption } from "../../types/SelectOption.jsx";
import metrics from "../../utils/metrics.js";
import EntitySearchStore, {
  EntitySearchConfig,
} from "../../stores/EntitySearchStore.js";
import EntitySearchBar from "./EntitySearchBar.jsx";

type Props = {|
  hideSearch: ?boolean,
|};

type State = {|
  searchConfig: EntitySearchConfig,
  sortField: string,
|};

class EntitySearchSort extends React.Component<Props, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    const sortField = EntitySearchStore.getSortField();
    const defaultSort = EntitySearchStore.getDefaultSortField();
    const searchConfig = EntitySearchStore.getSearchConfig();

    const state = {
      searchConfig: searchConfig,
      sortField: searchConfig.sortFields.find(
        option => option.value === (sortField || defaultSort)
      ),
    };

    return state;
  }

  render(): React$Node {
    return this.props.hideSearch ? (
      <React.Fragment>{this._renderSortFieldDropdown()}</React.Fragment>
    ) : (
      <div className="ProjectSearchSort-container">
        <EntitySearchBar />
        {this._renderSortFieldDropdown()}
      </div>
    );
  }

  _handleSubmitSortField(sortOption: SelectOption): void {
    this.setState({ sortField: sortOption.value }, function() {
      this._onSubmitSortField();
    });
  }

  _onSubmitSortField(): void {
    UniversalDispatcher.dispatch({
      type: "SET_SORT",
      sortField: this.state.sortField,
    });
    metrics.logSearchChangeSortEvent(
      this.state.sortField,
      this.state.searchConfig.name
    );
  }

  _renderSortFieldDropdown(): React$Node {
    return (
      <Select
        options={this.state.searchConfig.sortFields}
        value={this.state && this.state.sortField}
        onChange={this._handleSubmitSortField.bind(this)}
        classNamePrefix="ProjectSearchSort"
        className="form-control ProjectSearchSort-sortform"
        simpleValue={true}
        isClearable={false}
        isMulti={false}
      />
    );
  }
}

export default Container.create(EntitySearchSort);
