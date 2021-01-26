// @flow

import React from "react";
import { Container } from "flux/utils";
import { ReduceStore } from "flux/utils";
import {
  TagDefinition,
  TagDefinitionCount,
} from "../../../utils/ProjectAPIUtils.js";
import EventLocationSearchSection from "./EventLocationSearchSection.jsx";
import EventAPIUtils from "../../../utils/EventAPIUtils.js";
import EventSearchStore from "../../../stores/EventSearchStore.js";
import EventSearchDispatcher from "../../../stores/EventSearchDispatcher.js";
import RenderFilterCategory from "../../FindProjects/Filters/RenderFilterCategory.jsx";
import metrics from "../../../utils/metrics";
import _ from "lodash";

/**
 * @title: Title of the dropdown
 */
type Props = {|
  title: string,
|};

type State = {|
  tagsByCategory: Dictionary<$ReadOnlyArray<TagDefinitionCount>>,
  filterCounts: ?{ [key: string]: number },
  selectedTags: ?{ [key: string]: boolean },
|};

class EventFilterDataContainer extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      tags: null,
      selectedTags: null,
      filterCounts: null,
    };

    // passing true to fetchTagsByCategory asks backend to return num_times in API response
    EventAPIUtils.fetchAllTags((tags: $ReadOnlyArray<TagDefinitionCount>) => {
      //Need to do some work before setting state: Remove empty tags, generate cat/subcat totals, cleanup, then set state.
      //Generate category and subcategory totals - this is number of FILTERS and not total number of PROJECTS
      //So this may be used for "Select All" checkbox reference but will not be used for display of counts in DOM
      let subcatCount = _.countBy(tags, "subcategory");
      let catCount = _.countBy(tags, "category");
      let countMergeResult = _.merge(catCount, subcatCount);
      //Event tags by category before generating child components
      let sorted = _.groupBy(tags, "category");

      //last, set state with our computed data
      this.setState({
        filterCounts: countMergeResult,
        tagsByCategory: sorted,
      });
    });
    this._checkEnabled = this._checkEnabled.bind(this);
    this._selectOption = this._selectOption.bind(this);
  }

  static getStores(): $ReadOnlyArray<ReduceStore> {
    return [EventSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      selectedTags: _.mapKeys(
        EventSearchStore.getSelectedTags().toArray(),
        (tag: TagDefinition) => tag.tag_name
      ),
    };
  }

  render(): React$Node {
    //should render a number of <RenderFilterCategory> child components

    return (
      <div>
        {this.state.tagsByCategory ? this._renderFilterCategories() : null}
        <EventLocationSearchSection />
      </div>
    );
  }

  _renderFilterCategories(): void {
    // TODO: Display in sorted order if we have more than one tag category
    const categories: $ReadOnlyArray<string> = Object.keys(
      this.state.tagsByCategory
    );
    const displayFilters: $ReadOnlyArray<React$Node> = categories.map(key => (
      <RenderFilterCategory
        key={key}
        categoryCount={_.sumBy(this.state.tagsByCategory[key], "num_times")} //for displaying "category total" numbers
        category={key}
        data={_.sortBy(this.state.tagsByCategory[key], tag =>
          tag.display_name.toUpperCase()
        )}
        hasSubcategories={_.every(
          this.state.tagsByCategory[key],
          "subcategory"
        )}
        checkEnabled={this._checkEnabled}
        selectOption={this._selectOption}
      />
    ));
    return (
      <div className="ProjectFilterDataContainer-root">{displayFilters}</div>
    );
  }

  _checkEnabled(tag: TagDefinition): boolean {
    return !!this.state.selectedTags[tag.tag_name];
  }

  _selectOption(tag: TagDefinition): void {
    let tagInState = _.has(this.state.selectedTags, tag.tag_name);
    //if tag is NOT currently in state, add it, otherwise remove
    if (!tagInState) {
      EventSearchDispatcher.dispatch({
        type: "ADD_TAG",
        tag: tag.tag_name,
      });
      metrics.logSearchFilterByTagEvent(tag);
    } else {
      EventSearchDispatcher.dispatch({
        type: "REMOVE_TAG",
        tag: tag,
      });
    }
  }
}

export default Container.create(EventFilterDataContainer);
