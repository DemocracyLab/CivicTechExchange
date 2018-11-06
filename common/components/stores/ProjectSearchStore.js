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
import Section from "../enums/Section.js";
import _ from 'lodash'

export type FindProjectsArgs = {|
  keyword: string,
  sortField: string,
  location: string,
  issues: string,
  tech: string,
  role: string,
  org: string,
  stage: string,
  url: string
|};

type FindProjectsResponse = {|
  +projects: $ReadOnlyArray<ProjectAPIData>,
|};

type FindProjectsData = {|
  +projects: $ReadOnlyArray<Project>,
|};

export type ProjectSearchActionType = {
  type: 'INIT',
  findProjectsArgs: FindProjectsArgs
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
  type: 'SET_SORT',
  sortField: string,
} | {
  type: 'SET_LOCATION',
  location: string,
} | {
  type: 'CLEAR_FILTERS',
} | {
  type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
  projectsResponse: FindProjectsResponse,
};

const DEFAULT_STATE = {
  keyword: '',
  sortField: '',
  location: '',
  tags: List(),
  projectsData: {},
  findProjectsArgs: {}
};

class State extends Record(DEFAULT_STATE) {
  keyword: string;
  sortField: string;
  location: string;
  projectsData: FindProjectsData;
  tags: $ReadOnlyArray<string>;
  findProjectsArgs: FindProjectsArgs;
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
        let initialState: State = new State();
        if(action.findProjectsArgs) {
          initialState = this._initializeFilters(initialState, action.findProjectsArgs);
        }
        initialState = initialState.set('findProjectsArgs', action.findProjectsArgs || {});
        return this._loadProjects(initialState);
      case 'ADD_TAG':
        return this._loadProjects(this._addTagToState(state, action.tag));
      case 'REMOVE_TAG':
        state = state.set('tags', state.tags.filter(tag => tag !== action.tag.tag_name));
        return this._loadProjects(state);
      case 'SET_KEYWORD':
        return this._loadProjects(this._addKeywordToState(state, action.keyword));
      case 'SET_SORT':
        return this._loadProjects(this._addSortFieldToState(state, action.sortField));
      case 'SET_LOCATION':
        return this._loadProjects(this._addLocationToState(state, action.location));
      case 'CLEAR_FILTERS':
        return this._loadProjects(this._clearFilters(state));
      case 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        let projects = action.projectsResponse.projects.map(ProjectAPIUtils.projectFromAPIData);
        let allTags = _.mapKeys(action.projectsResponse.tags, (tag:TagDefinition) => tag.tag_name);
        // Remove all tag filters that don't match an existing tag name
        state = state.set('tags', state.tags.filter(tag => allTags[tag]));
        return state.set('projectsData', {
          projects: List(projects),
          allTags: allTags,
        });
      default:
        (action: empty);
        return state;
    }
  }

  _updateFindProjectArgs(state: State): State {
    if(state.projectsData && state.projectsData.allTags) {
      const findProjectsArgs: FindProjectsArgs = _.pickBy({
        keyword: state.keyword,
        sortField: state.sortField,
        location: state.location,
        issues: this._getTagCategoryParams(state, TagCategory.ISSUES),
        tech: this._getTagCategoryParams(state, TagCategory.TECHNOLOGIES_USED),
        role: this._getTagCategoryParams(state, TagCategory.ROLE),
        org: this._getTagCategoryParams(state, TagCategory.ORGANIZATION),
        stage: this._getTagCategoryParams(state, TagCategory.PROJECT_STAGE),
        url: state.url,
        positions: state.positions
      }, _.identity);

      state = state.set('findProjectsArgs',findProjectsArgs);
    }

    return state;
  }

  _updateWindowUrl(state: State) {
    const windowUrl: string = urls.constructWithQueryString(urls.section(Section.FindProjects), state.findProjectsArgs);
    history.pushState({},null,windowUrl);
  }

  _initializeFilters(state: State, findProjectsArgs: FindProjectsArgs): State {
    state = this._addTagFilters(state, findProjectsArgs.issues);
    state = this._addTagFilters(state, findProjectsArgs.role);
    state = this._addTagFilters(state, findProjectsArgs.tech);
    state = this._addTagFilters(state, findProjectsArgs.org);
    state = this._addTagFilters(state, findProjectsArgs.stage);
    state = this._addKeywordToState(state, findProjectsArgs.keyword);
    state = this._addSortFieldToState(state, findProjectsArgs.sortField);
    state = this._addLocationToState(state, findProjectsArgs.location && decodeURI(findProjectsArgs.location));

    return state;
  }

  _addTagFilters(state: State, filter:string): State {
    if(filter) {
      filter.split(",").forEach((tag) => {
        state = this._addTagToState(state, tag);
      });
    }
    return state;
  }

  _addTagToState(state: State, tag: string): State {
    const newTags:$ReadOnlyArray<string> = state.tags.concat(tag);
    return state.set('tags', newTags);
  }

  _addKeywordToState(state: State, keyword: string): State {
    state = state.set('keyword', keyword);
    return state;
  }

  _addSortFieldToState(state: State, sortField: string): State {
    state = state.set('sortField', sortField);
    return state;
  }

  _addLocationToState(state: State, location: string): State {
    state = state.set('location', location);
    return state;
  }

  _clearFilters(state: State): State {
    state = state.set('keyword', '');
    state = state.set('sortField', '');
    state = state.set('location', '');
    state = state.set('tags', List());
    return state;
  }

  _loadProjects(state: State): State {
    state = this._updateFindProjectArgs(state);
    this._updateWindowUrl(state);

    const url: string = urls.constructWithQueryString('/api/projects', state.findProjectsArgs);
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

  _getTagCategoryParams(state: State, category: string): ?string {
    const tags = this.getTags(state).filter(tag => tag.category === category);
    return tags.map(tag => tag.tag_name).join(',');
  }

  getKeyword(): string {
    return this.getState().keyword;
  }

  getSortField(): string {
    return this.getState().sortField;
  }

  getLocation(): string {
    return this.getState().location;
  }

  getProjects(): List<Project> {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.projects;
  }

  getTags(inProgressState: ?State): List<TagDefinition> {
    const state: State = inProgressState || this.getState();
    if(state.projectsData && state.projectsData.allTags && state.tags) {
      return List(state.tags.map(tag => state.projectsData.allTags[tag]));
    } else {
      return List();
    }
  }
}

export default new ProjectSearchStore();
