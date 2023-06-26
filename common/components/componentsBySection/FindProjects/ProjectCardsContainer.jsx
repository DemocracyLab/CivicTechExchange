// @flow

import _ from "lodash";
import React from "react";
import type { FluxReduceStore } from "flux/utils";
import EntityTagContainer from "../../common/search/EntityTagContainer.jsx";
import EntitySearchSort from "../../common/search/EntitySearchSort.jsx";
import { Container } from "flux/utils";
import { List } from "immutable";
import ProjectCard from "./ProjectCard.jsx";
import EntitySearchStore from "../../stores/EntitySearchStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import LoadingMessage from "../../chrome/LoadingMessage.jsx";
import metrics from "../../utils/metrics.js";
import { ProjectData } from "../../utils/ProjectAPIUtils.js";
import type { LocationRadius } from "../../common/location/LocationRadius.js";

type Props = {|
  showSearchControls: ?boolean,
  staticHeaderText: ?string,
  onSelectProject: ?Function,
  selectableCards: ?boolean,
  alreadySelectedProjects: ?List<string>, // todo: proper state management
  handleEmptyProject: ?Function,
|};

type State = {|
  projects: List<ProjectData>,
  project_pages: number,
  current_page: number,
  project_count: number,
  legacyLocation: string,
  location: LocationRadius,
  error: boolean,
|};

class ProjectCardsContainer extends React.Component<Props, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    const count = EntitySearchStore.getNumberOfEntities();
    if (_.isNumber(count)) {
      metrics.logProjectSearchResults(
        count,
        EntitySearchStore.getQueryString()
      );
    }
    return {
      projects: EntitySearchStore.getEntities(),
      project_pages: EntitySearchStore.getEntityPages(),
      project_count: count,
      current_page: EntitySearchStore.getCurrentPage(),
      projects_loading: EntitySearchStore.isLoading(),
      keyword: EntitySearchStore.getKeyword() || "",
      tags: EntitySearchStore.getTags() || [],
      legacyLocation: EntitySearchStore.getLegacyLocation() || "",
      location: EntitySearchStore.getLocation() || "",
      error: EntitySearchStore.getError(),
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col">
        {this.props.showSearchControls ? (
          <React.Fragment>
            <EntitySearchSort />
            <EntityTagContainer />
          </React.Fragment>
        ) : null}
        <div className="row">
          {!_.isEmpty(this.state.projects) && !this.props.supressHeader && (
            <h3 className="ProjectCardContainer-header">
              {this._renderCardHeaderText()}
            </h3>
          )}
          {this._renderCards()}
        </div>
        <div>{this._renderPagination()}</div>
      </div>
    );
  }

  _renderCardHeaderText(): React$Node {
    if (this.props.staticHeaderText) {
      return this.props.staticHeaderText;
    } else if (
      this.state.keyword ||
      this.state.tags.size > 0 ||
      this.state.legacyLocation ||
      (this.state.location &&
        this.state.location.latitude &&
        this.state.location.longitude)
    ) {
      return this.state.project_count === 1
        ? this.state.project_count + " tech-for-good project found"
        : this.state.project_count + " tech-for-good projects found";
    } else {
      return "Find and volunteer with innovative tech-for-good projects";
    }
  }

  _renderCards(): React$Node {
    if (
      this.state.error ||
      (this.state.projects &&
        this.state.projects.size === 0 &&
        this.props.handleEmptyProject)
    ) {
      this.props.handleEmptyProject && this.props.handleEmptyProject();
    }
    return !this.state.projects ? (
      <LoadingMessage message="Loading projects..." />
    ) : this.state.projects.size === 0 ? (
      "No projects match the provided criteria. Try a different set of filters or search term."
    ) : (
      this.state.projects.map((project, index) => (
        <div className="col-sm-12 col-lg-6">
          <ProjectCard
            project={project}
            key={index}
            textlen={140}
            skillslen={4}
          />
        </div>
      ))
    );
  }

  _handleFetchNextPage(e: object): void {
    e.preventDefault();

    const nextPage =
      this.state.current_page + 1 <= this.state.project_pages
        ? this.state.current_page + 1
        : this.state.current_page;

    this.setState({ current_page: nextPage }, function() {
      UniversalDispatcher.dispatch({
        type: "SET_PAGE",
        page: this.state.current_page,
      });
    });
  }

  _renderPagination(): ?React$Node {
    if (
      this.state.current_page === this.state.project_pages &&
      !this.state.projects_loading
    ) {
      return null;
    }
    if (!_.isEmpty(this.state.projects) && this.state.projects_loading) {
      return (
        <div className="page_selection_footer">
          <button className="btn btn-primary disabled">Loading...</button>
        </div>
      );
    }
    return this.state.projects && this.state.projects.size !== 0 ? (
      <div className="page_selection_footer">
        <button
          className="btn btn-primary"
          onClick={this._handleFetchNextPage.bind(this)}
        >
          More Projects...
        </button>
      </div>
    ) : null;
  }
}

export default Container.create(ProjectCardsContainer);
