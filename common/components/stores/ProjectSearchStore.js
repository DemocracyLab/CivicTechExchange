// @flow

import type {IssueAreaType} from '../enums/IssueArea';

import {ReduceStore} from 'flux/utils';
import ProjectSearchDispatcher from './ProjectSearchDispatcher.js';
import {List, Record} from 'immutable'
import lodash from 'lodash';

export type Project = {|
  +description: string,
  +issueArea: string,
  +location: string,
  +name: string,
|};

type ProjectAPIData = {|
  +project_description: string,
  +project_issue_area: $ReadOnlyArray<{|+name: string|}>,
  +project_location: string,
  +project_name: string,
|};

export type ProjectSearchActionType = {
  type: 'INIT',
} | {
  type: 'SET_ISSUE_AREA',
  issueArea: IssueAreaType,
} | {
  type: 'SET_KEYWORD',
  keyword: string,
} | {
  type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
  projects: List<Project>,
};

const DEFAULT_STATE = {
  issueArea: null,
  keyword: '',
  projects: List(),
};

class State extends Record(DEFAULT_STATE) {
  issueArea: ?IssueAreaType;
  keyword: string;
  projects: List<Project>;
}

class ProjectSearchStore extends ReduceStore<State> {
  constructor(): void {
    super(ProjectSearchDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: ProjectSearchActionType): State {
    let newState = new State();
    switch (action.type) {
      case 'INIT':
        newState = this._clearProjects(state);
        this._loadProjects(newState);
        return newState;
      case 'SET_ISSUE_AREA':
        newState = this._clearProjects(
          state.set('issueArea', action.issueArea),
        );
        this._loadProjects(newState);
        return newState;
      case 'SET_KEYWORD':
        newState = this._clearProjects(state.set('keyword', action.keyword));
        this._loadProjects(newState);
        return newState;
      case 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        return state.set('projects', action.projects);
      default:
        (action: empty);
        return state;
    }
  }

  _clearProjects(state: State): State {
    return state.set('projects', null);
  }

  _loadProjects(state: State): void {
    const {keyword, issueArea} = state;
    const url = [
      '/api/projects?',
      keyword ? '&keyword=' + keyword : null,
      issueArea
        ? '&issueArea=' + lodash.snakeCase(issueArea)
        : null,
    ].join('');
    fetch(new Request(url))
      .then(response => response.json())
      .then(projects =>
        ProjectSearchDispatcher.dispatch({
          type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
          projects: List(projects.map(this._projectFromAPIData)),
        }),
      );
  }

  _projectFromAPIData(apiData: ProjectAPIData): Project {
    return {
      description: apiData.project_description,
      issueArea:
        apiData.project_issue_area.length != 0
          ? apiData.project_issue_area[0].name
          : 'None',
      location: apiData.project_location,
      name: apiData.project_name,
    };
  }

  getKeyword(): string {
    return this.getState().keyword;
  }

  getProjects(): List<Project> {
    return this.getState().projects;
  }
}

export default new ProjectSearchStore();
