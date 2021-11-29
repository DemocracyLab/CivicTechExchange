// component handles all project filtering data collection, organizing, and sending to RenderFilterCategory

// @flow
import React from "react";
import { Container } from "flux/utils";
import type { TagDefinition } from "../../../utils/ProjectAPIUtils.js";
import LocationSearchSection from "./LocationSearchSection.jsx";
import ProjectSearchStore from "../../../stores/ProjectSearchStore.js";
import RenderFilterCategory from "./RenderFilterCategory.jsx";
import FavoriteFilter from "../FavoriteFilter.jsx";
import FavoritesStore from "../../../stores/FavoritesStore.js";
import CurrentUser from "../../../utils/CurrentUser.js";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import _ from "lodash";

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
      isReady: false,
      showOffCanvasFilters: false,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      selectedTags: _.mapKeys(
        ProjectSearchStore.getTags().toArray(),
        (tag: TagDefinition) => tag.tag_name
      ),
      isReady: true,
    };
  }
  // parent div handles visibility on desktop/mobile, child div handles styling of dropdowns, may be able to reduce later
  render(): React$Node {
    return this.state.isReady ? (
      <React.Fragment>
        <div className="ProjectFilterContainer-root d-none d-lg-flex">
          <div className="ProjectFilterContainer-nav mr-auto">
            {this._displayFilters(false)}
          </div>
        </div>
        {this._showOffCanvasFilters()}
      </React.Fragment>
    ) : null;
  }

  _displayFilters(isMobileLayout: boolean): React$Node {
    const showFavorites: boolean = CurrentUser.isLoggedIn();
    // this return is more verbose than it 'needs to be' and we may reduce this to a map later, but it's code readability vs length

    return (
      <React.Fragment>
        {showFavorites && <FavoriteFilter isMobileLayout={isMobileLayout} />}
        <RenderFilterCategory
          category="Role"
          displayName={"Roles Needed"}
          hasSubcategories={true}
          isMobileLayout={isMobileLayout}
        />
        <RenderFilterCategory
          category="Issue(s) Addressed"
          displayName={"Issue Areas"}
          hasSubcategories={false}
          isMobileLayout={isMobileLayout}
        />
        <LocationSearchSection isMobileLayout={isMobileLayout} />
        <RenderFilterCategory
          category="Technologies Used"
          displayName={"Technologies Used"}
          hasSubcategories={true}
          isMobileLayout={isMobileLayout}
        />
        <RenderFilterCategory
          category="Project Stage"
          displayName={"Project Stage"}
          hasSubcategories={false}
          isMobileLayout={isMobileLayout}
        />
        <RenderFilterCategory
          category="Organization Type"
          displayName={"Organization Type"}
          hasSubcategories={false}
          isMobileLayout={isMobileLayout}
        />
      </React.Fragment>
    );
  }

  //TODO: calling displayFilters here alone may not be correct (calls dropdown items without parent Nav wrapper)
  // also refactor to avoid calling twice if possible
  _showOffCanvasFilters(): React$Node {
    return (
      <React.Fragment>
        <Button
          variant="primary"
          onClick={() => this._handleModalClick()}
          className="d-block d-lg-none"
        >
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
          <Modal.Body>{this._displayFilters(true)}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => this._handleModalClick()}
            >
              Close
            </Button>
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
}

export default Container.create(ProjectFilterContainer);
