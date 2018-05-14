// @flow

import type {Tag} from './TagStore';

import {ReduceStore} from 'flux/utils';
import ProjectSearchDispatcher from './ProjectSearchDispatcher.js';
import {List, Record} from 'immutable'
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import type {Project, TagDefinition, ProjectAPIData} from '../utils/ProjectAPIUtils.js';
import type {FileInfo} from '../../../common/FileInfo.jsx'
import TagCategory from "../common/tags/TagCategory.jsx";
import urls from "../utils/url.js";
import _ from 'lodash'

type AvailableFilters = {|
  +tags:{[key: string]: number}
|};

type FindProjectsResponse = {|
  +projects: $ReadOnlyArray<ProjectAPIData>,
  +availableFilters: AvailableFilters
|};

type FindProjectsData = {|
  +projects: $ReadOnlyArray<Project>,
  +availableFilters: AvailableFilters
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
  projectsResponse: FindProjectsResponse,
};

const DEFAULT_STATE = {
  keyword: '',
  tags: List(),
  projectsData: {}
};

class State extends Record(DEFAULT_STATE) {
  keyword: string;
  projectsData: FindProjectsData;
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
        return this._loadProjects(state.set('tags', state.tags.push(state.projectsData.allTags[action.tag])));
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
        return state.set('projectsData', {
          projects: List(action.projectsResponse.projects.map(ProjectAPIUtils.projectFromAPIData)),
          allTags: _.mapKeys(action.projectsResponse.tags, (tag:TagDefinition) => tag.tag_name),
          availableFilters: action.projectsResponse.availableFilters
        });
      default:
        (action: empty);
        return state;
    }
  }

  _loadProjects(state: State): State {
    const args = _.pickBy({
        keyword: state.keyword,
        issues: state.tags && this._getIssueAreasQueryParam(state)
      },_.identity);
    const url: string = urls.constructWithQueryString('/api/projects', args);
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse =>
        ProjectSearchDispatcher.dispatch({
          type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
          projectsResponse: getProjectsResponse
        }),
      );
    return state.set('projectsData', null);
  }

  _getIssueAreasQueryParam(state: State): ?string {
    const issueTags = state.tags.filter(tag => tag.category === TagCategory.ISSUES);
    return issueTags.map(tag => tag.tag_name).join(',');
  }

  getKeyword(): string {
    return this.getState().keyword;
  }

  getProjects(): List<Project> {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.projects;
  }
  
  getAllTags(): { [key: string]: TagDefinition }{
    const state: State = this.getState();
    return state.projectsData && state.projectsData.allTags;
  }
  
  getAvailableFilters(): AvailableFilters {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.availableFilters;
    
    
  }

  getTags(): List<TagDefinition> {
    return this.getState().tags;
  }
}

export default new ProjectSearchStore();
