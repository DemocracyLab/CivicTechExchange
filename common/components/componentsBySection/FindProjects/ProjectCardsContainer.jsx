// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';

import {Container} from 'flux/utils';
import {List} from 'immutable'
import ProjectCard from './ProjectCard.jsx';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
import React from 'react';
// import {Pagination} from 'react-bootstrap';
import { Pager } from 'react-bootstrap';

// import { url } from 'inspector';
import url from '../../utils/url.js';
import Section from '../../enums/Section.js';

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
      current_page: ProjectSearchStore.getCurrentPage(),
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectCardContainer col-12 col-md-9 col-xxl-10 p-0 m-0">
        <div className="container-fluid pl-0 pr-0">
          <div className="row">
            {this._renderCards()}
          </div>
          <div>
            {this._renderPagination()}
          </div>
        </div>
      </div>
    );
  }

  _renderCards(): React$Node {
    return !this.state.projects
      ? 'Loading projects ...'
      : this.state.projects.size === 0
        ? 'No projects match the provided criteria.  Sign up for an alert to be notified when matching projects are added or try a different set of filters.'
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

  // _itemStatus(pageNumber: number): object {
  //   // if (pageNumber > this.state.project_pages) return 'disabled';
  //   if (pageNumber === this.state.current_page) return { active: true };
  //   return { active: false };
  // }

  _handleGoToPreviousPage(): void {
    this.setState({current_page: this.state.current_page - 1 > 0 
      ? this.state.current_page - 1 
      : this.state.current_page }, function () {
      this._onChangePage();
    });
  }

  _handleGoToNextPage(e: object): void {
    this.setState({current_page: this.state.current_page + 1 <= this.state.project_pages 
      ? this.state.current_page + 1 
      : this.state.current_page }, function () {
      this._onChangePage();
    });
  }

  _onChangePage(): void {
    ProjectSearchDispatcher.dispatch({
      type: 'SET_PAGE',
      page: this.state.current_page,
    });
  }

  _renderPagination(): React$Node {
    return (
      this.state.projects && this.state.projects.size !== 0
      ? <Pager>
        <Pager.Item previous href="#" onClick={this._handleGoToPreviousPage.bind(this)}>
          &larr; Previous Page
        </Pager.Item>
        <p>Page {this.state.current_page} of {this.state.project_pages}</p>
        <Pager.Item next href="#" onClick={this._handleGoToNextPage.bind(this)}>
          Next Page &rarr;
        </Pager.Item>
      </Pager>
      : null
    );
  }
}



export default Container.create(ProjectCardsContainer);
