// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';

import {Container} from 'flux/utils';
import {List} from 'immutable'
import ProjectCard from './ProjectCard.jsx';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
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

  // static componentDidMount(): void {
  //   console.log('componentDidMount (ProjectCardsContainer)');
  //   this.setSate({ current_page: 1 });
  // }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    console.log('getStores');
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    console.log('calculateState');
    return {
      projects: ProjectSearchStore.getProjects(),
      project_pages: ProjectSearchStore.getProjectPages(),
      current_page: 1
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
    this.setState((prevState) => {
      const newState = Object.create(prevState);
      const prevPage = newState.current_page - 1;
      newState.current_page = prevPage >= 1 ? prevPage : 1;
      return newState;
    });
  }

  _handleGoToNextPage(e: object): void {
    this.setState((prevState) => {
      const newState = Object.create(prevState);
      const nextPage = newState.current_page + 1;
      newState.current_page = nextPage <= newState.project_pages ? nextPage : newState.project_pages;
      return newState;
    });
  }

  _renderPagination(): React$Node {
    return (
      <Pager>
        <Pager.Item previous href="#" onClick={this._handleGoToPreviousPage.bind(this)}>
          &larr; Previous Page
        </Pager.Item>
        <p>current page: {this.state.current_page}</p>
        <Pager.Item next href="#" onClick={this._handleGoToNextPage.bind(this)}>
          Next Page &rarr;
        </Pager.Item>
      </Pager>
    );
  }
}

export default Container.create(ProjectCardsContainer);
