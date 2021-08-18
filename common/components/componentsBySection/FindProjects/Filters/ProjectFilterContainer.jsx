// component handles all project filtering data collection, organizing, and sending to RenderFilterCategory

// @flow

import React from "react";
import { Container } from "flux/utils";
import type { TagDefinition } from "../../../utils/ProjectAPIUtils.js";
import LocationAutocomplete from "../../../common/location/LocationAutocomplete.jsx";
import type { LocationInfo } from "../../../common/location/LocationInfo";
import LocationSearchSection from "./LocationSearchSection.jsx";
import ProjectAPIUtils from "../../../utils/ProjectAPIUtils.js";
import ProjectSearchStore from "../../../stores/ProjectSearchStore.js";
import ProjectSearchDispatcher from "../../../stores/ProjectSearchDispatcher.js";
import RenderFilterCategory from "./RenderFilterCategory.jsx";
import metrics from "../../../utils/metrics";
import _ from "lodash";
import { List } from "immutable";
import Nav from "react-bootstrap/Nav";

/**
 * @category: Tag category to pull from
 * @title: Title of the dropdown
 */
type Props = {|
  title: string,
|};

type State = {|
  tags: ?$ReadOnlyArray<TagDefinition>,
  selectedTags: ?{ [key: string]: boolean },
|};

class ProjectFilterContainer extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      selectedTags: {},
      issueAreas: {},
      rolesNeeded: {},
      techUsed: {},
      projectStage: {},
      orgType: {},
      selectedTags: {},
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      // issueAreas: ProjectSearchStore.getSortedCategoryTags(
      //   "Issue(s) Addressed"
      // ),
      // rolesNeeded: ProjectSearchStore.getSortedCategoryTags("Role"),
      // techUsed: ProjectSearchStore.getSortedCategoryTags("Technologies Used"),
      // projectStage: ProjectSearchStore.getSortedCategoryTags("Project Stage"),
      // orgType: ProjectSearchStore.getSortedCategoryTags("Organization Type"),
      selectedTags: _.mapKeys(
        ProjectSearchStore.getTags().toArray(),
        (tag: TagDefinition) => tag.tag_name
      ),
    };
  }

  render(): React$Node {
    //should render a number of Flux view child components
    console.log("TESTING: getSortedCategoryTags:")
    console.log(ProjectSearchStore.getSortedCategoryTags("Role"));
    console.log(ProjectSearchStore.getSortedCategoryTags("Technologies Used"));
    console.log(ProjectSearchStore.getSortedCategoryTags("Project Stage"));
    console.log(ProjectSearchStore.getSortedCategoryTags("Organization Type"));

    return (
      <Nav justify variant="pills" className="ProjectFilterContainer-root">
        {this._displayFilters()}
        <LocationSearchSection />
      </Nav>
    );
  }

  _displayFilters(): React$Node {
    return (
      <div>
        Display Filters is rendering; eventually this should be a flux view
      </div>
    );
  }

  _checkEnabled(tag: TagDefinition): boolean {
    return !!this.state.selectedTags[tag.tag_name];
  }

  _selectOption(tag: TagDefinition): void {
    var tagInState = _.has(this.state.selectedTags, tag.tag_name);
    //if tag is NOT currently in state, add it, otherwise remove
    if (!tagInState) {
      ProjectSearchDispatcher.dispatch({
        type: "ADD_TAG",
        tag: tag.tag_name,
      });
      metrics.logSearchFilterByTagEvent(tag);
    } else {
      ProjectSearchDispatcher.dispatch({
        type: "REMOVE_TAG",
        tag: tag,
      });
    }
  }
}

export default Container.create(ProjectFilterContainer);
