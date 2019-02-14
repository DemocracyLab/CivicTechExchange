// @flow

import React from 'react'
import {Container} from 'flux/utils';
import type {TagDefinition} from '../../../utils/ProjectAPIUtils.js';
import ProjectAPIUtils from '../../../utils/ProjectAPIUtils.js';
import ProjectSearchStore from "../../../stores/ProjectSearchStore.js";
import ProjectSearchDispatcher from "../../../stores/ProjectSearchDispatcher.js";
import RenderFilterCategory from "./RenderFilterCategory.jsx";
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
  // selectedTags: ?{ [key: string]: boolean },
  // hasSubcategories: boolean
|};

class ProjectFilterDataContainer extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {tags: null};

    // passing true to fetchTagsByCategory asks backend to return num_times in API response
    ProjectAPIUtils.fetchAllTags(true, tags => {
      //Need to do some work before setting state: Remove empty tags, generate cat/subcat totals, cleanup, then set state.
      //Remove tags from API with num_times=0 before doing anything else
      let filteredTags = tags.filter(function(key) {
          return key.num_times > 0;
        })
      //Generate category and subcategory total item counts
      let subcatCount = _.countBy(filteredTags, 'subcategory' );
      let catCount = _.countBy(filteredTags, 'category');
      let countMergeResult = _.merge(catCount, subcatCount)
      //remove unneeded count of empty category/subcategory entries
      delete countMergeResult['']
      //Group tags by category before generating child components
      let grouped = _.groupBy(filteredTags, 'category');
      //TODO: Sort each category(/subcategory) by display_name for output to DOM
      let sorted = grouped;

      //last, set state with our computed data
      this.setState({
        tags: filteredTags,
        tagCounts: countMergeResult,
        sortedTags: sorted
      });
    });
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      selectedTags:_.mapKeys(ProjectSearchStore.getTags().toArray(), (tag: TagDefinition) => tag.tag_name)
    };
  }


  render(): React$Node {
    //should render a number of <RenderFilterCategory> child components
    return (
      <div>
        { this.state.sortedTags ? this._renderFilterCategories() : null }
      </div>
    );
  }

  _renderFilterCategories(): void {
    //iterate through this.state.sortedTags into key/value pairs, one per component
    //first get category names in an array to iterate over

    //TODO: Figure out how to organize this without const, if possible
    //TODO: Change Database "Role" field to match 1:1 to display name we want ("Roles Needed" or whatever) as the category headers are no longer manually defined and must match the role field

    // const categories = Object.keys(this.state.sortedTags)
    const fixedOrderCategories = ["Issue(s) Addressed", "Role", "Technologies Used", "Project Stage", "Organization"]
    //generate child components using each category key and pass the filter tags as props
    //TODO: Find a better way or place to sort this, possibly in child component to manage subcategories?
      const displayFilters = fixedOrderCategories.map(key =>
            <RenderFilterCategory
              category={key}
              data={
                this.state.sortedTags[key].sort(function(a, b) {
                  let nameA = a.display_name.toUpperCase(); // ignore upper and lowercase
                  let nameB = b.display_name.toUpperCase(); // ignore upper and lowercase
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }

                  // names must be equal
                  return 0;
                })
              }
            />
          );
        return (
            <div>
                {displayFilters}
            </div>
        )
    }
  }



export default Container.create(ProjectFilterDataContainer);
