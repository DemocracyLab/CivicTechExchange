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
import Navbar from "react-bootstrap/Navbar";

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
    this._selectOption = this._selectOption.bind(this);
    this._checkEnabled = this._checkEnabled.bind(this);
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
      <Navbar
        expand="lg"
        bg="navlight"
        variant="light"
        className="ProjectFilterContainer-root nav-pills pills-outline pills-rounded"
      >
        <Navbar.Toggle aria-controls="ProjectFilterContainer-root" />
        <Navbar.Collapse
          id="ProjectFilterContainer-root"
          className="flex-column"
        >
            <Nav className="ProjectFilterContainer-nav mr-auto">
            {this.state.isReady ? this._displayFilters() : null}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
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

    //TODO: mobile (OffCanvas possibly?), RFC needs subcat, filter functionality
    //possible ref: https://bootstrap-menu.com/detail-offcanvas-mobile.html
    // this is more verbose than it 'needs to be' and we may reduce this to a map later, but it's code readability vs length
    //TODO: IsReady prop isn't working as I want -- these render empty and then refresh full rather than waiting for ready
    return (
      this.state.isReady ? (<React.Fragment>
        <RenderFilterCategory
          cdata={this.state.rolesNeeded}
          displayName={"Roles Needed"}
          hasSubcategories={true}
          checkEnabled={this._checkEnabled}
          selectOption={this._selectOption}
        />
        <RenderFilterCategory
          cdata={this.state.issueAreas}
          displayName={"Issue Areas"}
          hasSubcategories={false}
          checkEnabled={this._checkEnabled}
          selectOption={this._selectOption}
        />
        <LocationSearchSection />
        <RenderFilterCategory
          cdata={this.state.techUsed}
          displayName={"Technologies Used"}
          hasSubcategories={true}
          checkEnabled={this._checkEnabled}
          selectOption={this._selectOption}
        />
        <RenderFilterCategory
          cdata={this.state.projectStage}
          displayName={"Project Stage"}
          hasSubcategories={false}
          checkEnabled={this._checkEnabled}
          selectOption={this._selectOption}
        />
        <RenderFilterCategory
          cdata={this.state.orgType}
          displayName={"Organization Type"}
          hasSubcategories={false}
          checkEnabled={this._checkEnabled}
          selectOption={this._selectOption}
        />
      </React.Fragment>) : null
    );
  }

  _checkEnabled(tag: TagDefinition): boolean {
    let selectedTags = this.state.selectedTags;
    return !!selectedTags[tag.tag_name];
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
