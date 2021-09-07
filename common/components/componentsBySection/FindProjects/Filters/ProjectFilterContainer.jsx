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
      isReady: false,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      issueAreas: ProjectSearchStore.getSortedCategoryTags(
        "Issue(s) Addressed"
      ).toArray(),
      rolesNeeded: ProjectSearchStore.getSortedCategoryTags("Role").toArray(),
      techUsed: ProjectSearchStore.getSortedCategoryTags(
        "Technologies Used"
      ).toArray(),
      projectStage: ProjectSearchStore.getSortedCategoryTags(
        "Project Stage"
      ).toArray(),
      orgType: ProjectSearchStore.getSortedCategoryTags(
        "Organization Type"
      ).toArray(),
      selectedTags: _.mapKeys(
        ProjectSearchStore.getTags().toArray(),
        (tag: TagDefinition) => tag.tag_name
      ),
      isReady: true,
    };
  }

  render(): React$Node {
    //should render a number of Flux view child components
    // TODO: verify if we need to keep this as a nav
    // TODO: Test instead of render null before ready, render a LoadingFrame?
    return (
      <Nav
        justify
        variant="pills"
        className="ProjectFilterContainer-root"
        expand={"lg"}
      >
        {this.state.isReady ? this._displayFilters() : null}
      </Nav>
    );
  }

  _displayFilters(): React$Node {
    // console.log("TESTING getSortedCategoryTags below:");
    // console.log(ProjectSearchStore.getSortedCategoryTags("Role").toArray());
    // console.log(
    //   ProjectSearchStore.getSortedCategoryTags("Technologies Used").toArray()
    // );
    // console.log(
    //   ProjectSearchStore.getSortedCategoryTags("Project Stage").toArray()
    // );
    // console.log(
    //   ProjectSearchStore.getSortedCategoryTags("Organization Type").toArray()
    // );

    //TODO: layout, scroll arrows, etc -- see https://codepen.io/pbreen/pen/oNZpKqp for prototype
    return (
      <div className="ProjectFilterContainer-scrollcontainer">
        <RenderFilterCategory
          cdata={this.state.rolesNeeded}
          displayName={"Roles Needed"}
          hasSubcategories={true}
        />
        <RenderFilterCategory
          cdata={this.state.issueAreas}
          displayName={"Issue Areas"}
          hasSubcategories={false}
        />
        <LocationSearchSection />
        <RenderFilterCategory
          cdata={this.state.techUsed}
          displayName={"Technologies Used"}
          hasSubcategories={true}
        />
        <RenderFilterCategory
          cdata={this.state.projectStage}
          displayName={"Project Stage"}
          hasSubcategories={false}
        />
        <RenderFilterCategory
          cdata={this.state.orgType}
          displayName={"Organization Type"}
          hasSubcategories={false}
        />
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
