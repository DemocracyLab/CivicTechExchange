// @flow

import React from 'react'
import {Container} from 'flux/utils';
import type {TagDefinition} from '../../../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../../../utils/ProjectAPIUtils.js';
import SelectorCollapsible from "../../../common/selection/SelectorCollapsible.jsx";
import ProjectSearchStore from "../../../stores/ProjectSearchStore.js";
import ProjectSearchDispatcher from "../../../stores/ProjectSearchDispatcher.js";
import metrics from "../../../utils/metrics";
import _ from 'lodash'

/**
 * @category: Tag category to pull from
 * @title: Title of the dropdown
 */
type Props = {|
  title: string
|};

type State = {|
  tags: ?$ReadOnlyArray<TagDefinition>,
  tagCounts: ?{ [key: string]: number },
  selectedTags: ?{ [key: string]: boolean },
  hasSubcategories: boolean
|};

/**
 * Dropdown selector for tags
 */
class ProjectFilterDataContainer extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {tags: null};

    // passing true to fetchTagsByCategory asks backend to return num_times in API response
    ProjectAPIUtils.fetchAllTags(true, tags => {
      //Need to do some calculations before setting state to both tags and tagCounts:

      //Remove tags with num_times=0 before setting state to avoid filtering later
      let filteredTags = tags.filter(function(key) {
          return key.num_times > 0;
        })

      //Generate category and subcategory total item counts
      let subcatCount = _.countBy(tags, 'subcategory' );
      let catCount = _.countBy(tags, 'category');
      let countMergeResult = _.merge(catCount, subcatCount)
       //remove unneeded count of empty category/subcategory entries
      delete countMergeResult['']

      //last, set state with our computed data
      this.setState({
        tags: filteredTags,
        tagCounts: countMergeResult
      });
    });
    this._tagEnabled = this._tagEnabled.bind(this);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      selectedTags:_.mapKeys(ProjectSearchStore.getTags().toArray(), (tag: TagDefinition) => tag.tag_name)
    };
  }


  selectTag(tag: TagDefinition): void {
    var tagInState = _.has(this.state.selectedTags, tag);
    //if tag is NOT currently in state, add it, otherwise remove
    if(!tagInState) {
      ProjectSearchDispatcher.dispatch({
        type: 'ADD_TAG',
        tag: tag,
      });
      metrics.logSearchFilterByTagEvent(tag);
    } else {
      ProjectSearchDispatcher.dispatch({
        type: 'REMOVE_TAG',
        tag: tag,
      });
    }
  }

  render(): React$Node {
    //test code, to be removed - this fn should render an as yet undefined <ChildComponent>

    return (
      <div>
        { this.state.tags ? this._testRenderTags() : null }
        <p>--- VERY GOOD DIVIDER LINE ---</p>
        { this.state.tags ? this._testRenderCategories(): null }
      </div>
    );
  }

  _testRenderTags(): void {
    const listItems = this.state.tags && this.state.tags.map((tag) =>
      <li>{tag.display_name} - {tag.num_times}</li>
    );
    return <ul>{listItems}</ul>

  }
  _testRenderCategories(): void {
    const categoryCount = this.state.tagCounts && Object.keys(this.state.tagCounts).map((key) =>
     <li key={key}>{key} - {this.state.tagCounts[key]}</li>
   );
    return <ul>{categoryCount}</ul>
  }

  _tagEnabled(tag: TagDefinition): boolean {
    //return true if tag is in this.state.selectedTags, else implicitly false
    return _.has(this.state.selectedTags, tag)
  }
}

export default Container.create(ProjectFilterDataContainer);
