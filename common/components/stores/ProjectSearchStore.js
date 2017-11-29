// @flow

import type {IssueAreaType} from '../enums/IssueArea';

import {ReduceStore} from 'flux/utils';
import ProjectSearchDispatcher from './ProjectSearchDispatcher.js';
import {List, Record} from 'immutable'

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
  projects: List(),
};

class State extends Record(DEFAULT_STATE) {
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
    switch (action.type) {
      case 'INIT':
        this._loadProjects({});
        return state.set('projects', null);
      case 'SET_ISSUE_AREA':
        this._loadProjects({issueArea: action.issueArea});
        return state.set('projects', null);
      case 'SET_KEYWORD':
        this._loadProjects({keyword: action.keyword});
        return state.set('projects', null);
      case 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        return state.set('projects', action.projects);
      default:
        (action: empty);
        return state;
    }
  }

  _loadProjects(
    {issueArea, keyword}: {issueArea?: ?IssueAreaType, keyword?: ?string}
  ): void {
    const url = [
      '/api/projects?',
      keyword ? '&keyword=' + keyword : null,
      issueArea
        ? '&issueArea=' + this._reformatIssueAreaForAPI(issueArea)
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

  _reformatIssueAreaForAPI(issueArea: IssueAreaType): string {
    return issueArea
      .replace(/\.?([A-Z])/g, (_, match) => "_" + match.toLowerCase())
      .replace(/^_/, "");
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

  getProjects(): List<Project> {
    return this.getState().projects;
  }
}

export default new ProjectSearchStore();
