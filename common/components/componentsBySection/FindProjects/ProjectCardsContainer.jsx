// @flow

import _ from "lodash";
import React from "react";
import type { Project } from "../../stores/ProjectSearchStore.js";
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import { List } from "immutable";
import ProjectCard from "./ProjectCard.jsx";
import ProjectSearchStore from "../../stores/ProjectSearchStore.js";
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";
import LoadingMessage from "../../chrome/LoadingMessage.jsx";
import prerender from "../../utils/prerender.js";
import type { LocationRadius } from "../../stores/ProjectSearchStore.js";
import metrics from "../../utils/metrics.js";

type Props = {|
  onSelectProject: ?Function,
  selectableCards: ?boolean,
  alreadySelectedProjects: ?List<string>, // todo: proper state management
  rowMaximum: ?number,
|};

type State = {|
  projects: List<Project>,
  project_pages: number,
  current_page: number,
  project_count: number,
  legacyLocation: string,
  location: LocationRadius,
|};



class ProjectCardsContainer extends React.Component<Props, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }
  static calculateState(prevState: State): State {
    prerender.ready(!ProjectSearchStore.getProjectsLoading());
    const count = ProjectSearchStore.getNumberOfProjects();
    if (_.isNumber(count)) {
      metrics.logProjectSearchResults(
        count,
        ProjectSearchStore.getQueryString()
      );
    }
    return {
      projects: ProjectSearchStore.getProjects(),
      project_pages: ProjectSearchStore.getProjectPages(),
      project_count: count,
      current_page: ProjectSearchStore.getCurrentPage(),
      projects_loading: ProjectSearchStore.getProjectsLoading(),
      keyword: ProjectSearchStore.getKeyword() || "",
      tags: ProjectSearchStore.getTags() || [],
      legacyLocation: ProjectSearchStore.getLegacyLocation() || "",
      location: ProjectSearchStore.getLocation() || "",
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col-12">
        <div className="row">
          {!_.isEmpty(this.state.projects) && (
            <h3 className="ProjectCardContainer-header">
              {this._renderHelperMessage()}
            </h3>
          )}
          {this._renderCards()}
        </div>
        <div>{this._renderPagination()}</div>
      </div>
    );
  }

  _renderHelperMessage(): React$Node {
    if (
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
      return this._contextualHelperMessage();
    }
  }

  _contextualHelperMessage(): React$Node {
    //todo: no problems returns null, otherwise if project_count = 0 return based on filters only, keyword only, filters+keyword specific errors
    if(this.state.project_count === 0) {
      return <div><p> 0 projects found, this is the contextual helper message</p></div>
    } else {
      return null;
    }
  }

  _renderCards(): React$Node {
    //todo: clean this if/else selector up
    //todo: defaultProps value for rowMaximum, set to 3
    const rowMaximum = _.isNumber(this.props.rowMaximum) ? this.props.rowMaximum : 3;
    let colClasses = "";
    if (rowMaximum === 3) {
      colClasses = "col-sm-12 col-lg-6 col-xl-4";
    } else if (rowMaximum === 2) {
      colClasses = "col-sm-12 col-lg-6";
    } else if (rowMaximum === 1) {
      colClasses = "col-sm-12";
    } else {
      colClasses = "col-sm-12 col-lg-6 col-xl-4"
      console.log("Your rowMaximum prop is set to an unsupported value (supported values: 1-3), defaulting to 3")
    }

    return !this.state.projects ? (
      <LoadingMessage message="Loading projects..." />
    ) : (
      this.state.projects.map((project, index) => (
        <div className={colClasses} key={"project-" + project.id}>
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
      ProjectSearchDispatcher.dispatch({
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
