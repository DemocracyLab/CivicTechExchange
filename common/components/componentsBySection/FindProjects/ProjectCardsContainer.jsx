// @flow


import _ from 'lodash';
import React from 'react';
import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';
import ProjectSearchSort from './ProjectSearchSort.jsx';
import ProjectTagContainer from './ProjectTagContainer.jsx';
import {Container} from 'flux/utils';
import {List} from 'immutable'
import ProjectCard from './ProjectCard.jsx';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import LoadingMessage from '../../chrome/LoadingMessage.jsx';
import prerender from "../../utils/prerender.js";

type State = {|
  projects: List<Project>,
  project_pages: number,
  current_page: number,
  project_count: number
|};

class ProjectCardsContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    prerender.ready(!ProjectSearchStore.getProjectsLoading());
    
    return {
      projects: ProjectSearchStore.getProjects(),
      project_pages: ProjectSearchStore.getProjectPages(),
      project_count: ProjectSearchStore.getNumberOfProjects(),
      current_page: ProjectSearchStore.getCurrentPage(),
      projects_loading: ProjectSearchStore.getProjectsLoading(),
      keyword: ProjectSearchStore.getKeyword() || '',
      tags: ProjectSearchStore.getTags() || [],
      location: ProjectSearchStore.getLocation() || ''
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col-12 col-md-9 col-xxl-10 p-0 m-0">
        <div className="container-fluid">
            <ProjectSearchSort />
            <ProjectTagContainer />
          <div className="row">
            {!_.isEmpty(this.state.projects) && <h2 className="ProjectCardContainer-header">{this._renderCardHeaderText()}</h2>}
            {this._renderCards()}
          </div>
          <div>
            {this._renderPagination()}
          </div>
        </div>
      </div>
    );
  }

  _renderCardHeaderText(): React$Node {
    if (this.state.keyword || this.state.tags.size > 0 || this.state.location) {
      return this.state.project_count === 1 ? this.state.project_count + ' tech-for-good project found' : this.state.project_count + ' tech-for-good projects found'
    } else {
      return 'Find and volunteer with innovative tech-for-good projects'
    }
  }

  _renderCards(): React$Node {
    return !this.state.projects
      ? <LoadingMessage message="Loading projects..." />
      : this.state.projects.size === 0
        ? 'No projects match the provided criteria. Try a different set of filters or search term.'
        : this.state.projects.map(
          (project, index) =>
            <ProjectCard
              project={project}
              key={index}
              textlen={140}
              skillslen={4}
            />
        );
  }

  _handleFetchNextPage(e: object): void {
    e.preventDefault();

    const nextPage = this.state.current_page + 1 <= this.state.project_pages
      ? this.state.current_page + 1
      : this.state.current_page;

    this.setState({current_page: nextPage }, function () {
      ProjectSearchDispatcher.dispatch({
        type: 'SET_PAGE',
        page: this.state.current_page,
      });
    });
  }

  _renderPagination(): ?React$Node {
    if ((this.state.current_page === this.state.project_pages) && !this.state.projects_loading ) {
      return null;
    }
    if (!_.isEmpty(this.state.projects) && this.state.projects_loading) {
      return (
        <div className="page_selection_footer">
          <button className="btn btn-primary disabled">
            Loading...
          </button>
        </div>
      )
    }
    return (
      this.state.projects && this.state.projects.size !== 0
      ? <div className="page_selection_footer">
        <button className="btn btn-primary" onClick={this._handleFetchNextPage.bind(this)}>
          More Projects...
        </button>
      </div>
      : null
    );
  }
}



export default Container.create(ProjectCardsContainer);
