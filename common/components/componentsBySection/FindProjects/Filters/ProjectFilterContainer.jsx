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
import UniversalDispatcher from "../../../stores/UniversalDispatcher.js";
import RenderFilterCategory from "./RenderFilterCategory.jsx";
import ModalWrapper from "../../../common/ModalWrapper.jsx";
import FavoriteFilter from "../FavoriteFilter.jsx";
import FavoritesStore from "../../../stores/FavoritesStore.js";
import CurrentUser from "../../../utils/CurrentUser.js";
import metrics from "../../../utils/metrics";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import { List } from "immutable";

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
  showOffCanvasFilters: boolean,
|};

//TODO: isReady does not work - need to show LoadingFrame or null until we get filter data from flux
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
      showOffCanvasFilters: false,
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
    return this.state.isReady ? (
      <React.Fragment>
        <Navbar
          expand="lg"
          bg="navlight"
          variant="light"
          className="ProjectFilterContainer-root"
          // onSelect={() => this._handleNavSelect()}
        >
          <Navbar.Toggle aria-controls="ProjectFilterContainer-root" />
          <Navbar.Collapse
            id="ProjectFilterContainer-root"
            className="flex-column"
          >
            <Nav className="ProjectFilterContainer-nav mr-auto">
              {this._displayFilters()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this._showOffCanvasFilters()}
      </React.Fragment>
    ) : null;
  }

  _displayFilters(): React$Node {
    const showFavorites: boolean =
      CurrentUser.isLoggedIn() && !FavoritesStore.noFavorites();
    // this return is more verbose than it 'needs to be' and we may reduce this to a map later, but it's code readability vs length

    return (
      <React.Fragment>
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
        {showFavorites && <FavoriteFilter />}
      </React.Fragment>
    );
  }

  //TODO: calling displayFilters here alone may not be correct (calls dropdown items without parent Nav wrapper)
  // also refactor to avoid calling twice if possible
  _showOffCanvasFilters(): React$Node {
    return (
      <React.Fragment>
        <Button variant="primary" onClick={() => this._handleModalClick()}>
          Filter Results
        </Button>
        <Modal
          className="ProjectFilterContainer-offcanvas fixed-left"
          show={this.state.showOffCanvasFilters}
          onHide={() => this._handleModalClick()}
          aria-labelledby="ProjectFilterContainer-offcanvas-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="ProjectFilterContainer-offcanvas-title">
              Filter Results
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Navbar
          defaultExpand
          collapseOnSelect={false}
          bg="navlight"
          variant="light"
          className="ProjectFilterContainer-root ProjectFilterContainer-mobile-filters flex-column"
          // onSelect={() => this._handleNavSelect()}
        >
          <Navbar.Toggle aria-controls="ProjectFilterContainer-offcanvas-root" />
          <Navbar.Collapse
            id="ProjectFilterContainer-offcanvas-root"
            className="flex-column"
          >
            <Nav className="ProjectFilterContainer-nav mr-auto ">
              {this._displayFilters()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary">Button</Button>
            <Button variant="outline-secondary">Button #2</Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }

  _handleModalClick() {
    this.setState(prevState => ({
      showOffCanvasFilters: !prevState.showOffCanvasFilters,
    }));
  }

  _handleNavSelect() {
    // https://react-bootstrap-v4.netlify.app/components/navbar/#navbar-api
    //     A callback fired when a descendant of a child <Nav> is selected. Should be used to execute complex closing or other miscellaneous actions desired after selecting a descendant of <Nav>. Does nothing if no <Nav> or <Nav> descendants exist. The callback is called with an eventKey, which is a prop from the selected <Nav> descendant, and an event.
    // function (
    //  eventKey: mixed,
    //  event?: SyntheticEvent
    // )
    // For basic closing behavior after all <Nav> descendant onSelect events in mobile viewports, try using collapseOnSelect.
    // Note: If you are manually closing the navbar using this OnSelect prop, ensure that you are setting expanded to false and not toggling between true and false.

    //what we want is  for the collapse prop NOT to close UNLESS the onClick event was on a 'done with filters' button or outside the dropdown entirely, if possible?
    // but perhaps call an update function every click for things like counting num of active filters, etc?

  }

  _checkEnabled(tag: TagDefinition): boolean {
    let selectedTags = this.state.selectedTags;
    return !!selectedTags[tag.tag_name];
  }

  _selectOption(tag: TagDefinition): void {
    var tagInState = _.has(this.state.selectedTags, tag.tag_name);
    //if tag is NOT currently in state, add it, otherwise remove
    if (!tagInState) {
      UniversalDispatcher.dispatch({
        type: "ADD_TAG",
        tag: tag.tag_name,
      });
      metrics.logSearchFilterByTagEvent(tag);
    } else {
      UniversalDispatcher.dispatch({
        type: "REMOVE_TAG",
        tag: tag,
      });
    }
  }
}

export default Container.create(ProjectFilterContainer);
