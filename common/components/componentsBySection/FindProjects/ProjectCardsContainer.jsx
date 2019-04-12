// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';
import ProjectSearchSort from './ProjectSearchSort.jsx';
import ProjectTagContainer from './ProjectTagContainer.jsx';
import {Container} from 'flux/utils';
import {List} from 'immutable'
import ProjectCard from './ProjectCard.jsx';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import React from 'react';

type State = {|
  projects: List<Project>,
  project_pages: number,
  current_page: number
|};

class ProjectCardsContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
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
    console.log('project_count', this.state.project_count);
    if (this.state.keyword || this.state.tags.size > 0 || this.state.location) {
      return this.state.project_count === 1 ? this.state.project_count + ' tech-for-good project found' : this.state.project_count + ' tech-for-good projects found'
    } else {
      return 'Find and volunteer with the best tech-for-good projects'
    }
  }

  _renderCards(): React$Node {
    return !this.state.projects
      ? 'Loading projects ...'
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
    if (this.state.current_page === this.state.project_pages) {
      return null; // don't render button if we've loaded the last page
    }
    return (
      this.state.projects && this.state.projects.size !== 0 && !this.state.projects_loading
      ? <div className="page_selection_footer">
        <button className="page_button" onClick={this._handleFetchNextPage.bind(this)}>
          More Projects...
        </button>
      </div>
      : null
    );
  }
}



export default Container.create(ProjectCardsContainer);
