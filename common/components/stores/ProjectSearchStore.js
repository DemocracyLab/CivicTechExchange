// @flow

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
  type: 'FILTER_BY_KEYWORD',
  keyword: string,
} | {
  type: 'SET_PROJECTS',
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
      case 'FILTER_BY_KEYWORD':
        fetch(new Request(this._getAPIURL(action.keyword)))
          .then(response => response.json())
          .then(projects =>
            ProjectSearchDispatcher.dispatch({
              type: 'SET_PROJECTS',
              projects: List(projects.map(this._projectFromAPIData)),
            }),
          );
        return state.set('projects', null);
      case 'SET_PROJECTS':
        return state.set('projects', action.projects);
      default:
        (action: empty);
        return state;
    }
  }

  _getAPIURL(keyword: ?string): string {
    const baseURL = '/api/projects';
    return keyword
      ? baseURL + '?keyword=' + keyword
      : baseURL;
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
