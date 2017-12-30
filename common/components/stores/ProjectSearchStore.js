// @flow

import type {Tag} from './TagStore';

import {ReduceStore} from 'flux/utils';
import ProjectSearchDispatcher from './ProjectSearchDispatcher.js';
import {List, Record} from 'immutable'
import ProjectAPIUtils from '../utils/ProjectAPIUtils';

export type Project = {|
  +description: string,
  +id: number,
  +issueArea: string,
  +location: string,
  +name: string,
|};

export type ProjectSearchActionType = {
  type: 'INIT',
} | {
  type: 'ADD_TAG',
  tag: Tag,
} | {
  type: 'REMOVE_TAG',
  tag: Tag,
} | {
  type: 'SET_KEYWORD',
  keyword: string,
} | {
  type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
  projects: List<Project>,
};

const DEFAULT_STATE = {
  keyword: '',
  projects: List(),
  tags: List(),
};

class State extends Record(DEFAULT_STATE) {
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
    switch (action.type) {
      case 'INIT':
        return this._loadProjects(new State());
      case 'ADD_TAG':
        return this._loadProjects(state.set('tags', state.tags.push(action.tag)));
      case 'REMOVE_TAG':
        return this._loadProjects(
          state.set(
            'tags',
            state.tags.delete(
              /* $FlowFixMe I don't know why, but the action type isn't being
                subtyped here */
              state.tags.findIndex(tag => tag.id === action.tag.id),
            ),
          ),
        );
      case 'SET_KEYWORD':
        return this._loadProjects(state.set('keyword', action.keyword));
      case 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        return state.set('projects', action.projects);
      default:
        (action: empty);
        return state;
    }
  }

  _loadProjects(state: State): State {
    const url = [
      '/api/projects?',
      this._getKeywordQueryParam(state),
      this._getTagsQueryParam(state),
    ].join('');
    fetch(new Request(url))
      .then(response => response.json())
      .then(projects =>
        ProjectSearchDispatcher.dispatch({
          type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
          projects: List(projects.map(ProjectAPIUtils.projectFromAPIData)),
        }),
      );
    return state.set('projects', null);
  }

  _getKeywordQueryParam(state: State): ?string {
    return state.keyword ? '&keyword=' + state.keyword : null;
  }

  _getTagsQueryParam(state: State): ?string {
    return state.tags
      ? '&tags='
        + state.tags.map(tag => tag.tagName).join(',')
      : null;
  }

  getKeyword(): string {
    return this.getState().keyword;
  }

  getProjects(): List<Project> {
    return this.getState().projects;
  }

  getTags(): List<Tag> {
    return this.getState().tags;
  }
}

export default new ProjectSearchStore();
