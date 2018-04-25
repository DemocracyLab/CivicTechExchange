// @flow

import type {Tag} from './TagStore';

import {ReduceStore} from 'flux/utils';
import ProjectSearchDispatcher from './ProjectSearchDispatcher.js';
import {List, Record} from 'immutable'
import ProjectAPIUtils from '../utils/ProjectAPIUtils';
import type {FileInfo} from '../../../common/FileInfo.jsx'
import TagCategory from "../common/tags/TagCategory.jsx";
import urls from "../utils/url.js";
import _ from 'lodash'

export type Project = {|
  +description: string,
  +id: number,
  +issueArea: string,
  +location: string,
  +name: string,
  +thumbnail: FileInfo
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
    const args = _.pickBy({
        keyword: state.keyword,
        issues: this._getIssueAreasQueryParam(state)
      },_.identity);
    const url: string = urls.constructWithQueryString('/api/projects', args);
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse =>
        ProjectSearchDispatcher.dispatch({
          type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
          projects: List(getProjectsResponse.projects.map(ProjectAPIUtils.projectFromAPIData)),
        }),
      );
    return state.set('projects', null);
  }

  _getIssueAreasQueryParam(state: State): ?string {
    const issueTags = state.tags.filter(tag => tag.category === TagCategory.ISSUES);
    return issueTags.map(tag => tag.tagName).join(',');
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
