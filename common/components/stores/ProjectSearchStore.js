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

export type SearchSettings = {|
  updateUrl: boolean
|};

export type FindProjectsArgs = {|
  keyword: string,
  sortField: string,
  location: string,
  page: number,
  issues: string,
  tech: string,
  role: string,
  org: string,
  orgType: string,
  stage: string,
  url: string
|};

type FindProjectsResponse = {|
  +projects: $ReadOnlyArray<ProjectAPIData>,
  +numPages: number,
  +numProjects: number
|};

type FindProjectsData = {|
  +projects: $ReadOnlyArray<Project>,
  +numPages: number,
  +numProjects: number
|};

export type LocationRadius = {|
  latitude: number,
  longitude: number,
  radius: number
|};

function locationRadiusToString(locationRadius: LocationRadius): string {
  return `${locationRadius.latitude},${locationRadius.longitude},${locationRadius.radius}`;
}

function locationRadiusFromString(str: string): LocationRadius {
  const parts: $ReadOnlyArray<string> = str.split(",");
  // TODO: Handle legacy city strings
  // decodeURI(findProjectsArgs.location)
  return parts && (parts.length > 2) && {
    latitude: parseFloat(parts[0]),
    longitude: parseFloat(parts[1]),
    radius: parseInt(parts[2]),
  };
}

export type ProjectSearchActionType = {
  type: 'INIT',
  searchSettings: SearchSettings,
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
  location: LocationRadius
} | {
  type: 'SET_PAGE',
  page: number,
} | {
  type: 'CLEAR_FILTERS',
} | {
  type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
  projectsResponse: FindProjectsResponse,
};

const DEFAULT_STATE = {
  keyword: '',
  sortField: '',
  location: {},
  page: 1,
  tags: List(),
  projectsData: {},
  searchSettings: {
    updateUrl: false
  },
  findProjectsArgs: {},
  filterApplied: false,
  projectsLoading: false
};

class State extends Record(DEFAULT_STATE) {
  keyword: string;
  sortField: string;
  location: LocationRadius;
  page: number;
  projectsData: FindProjectsData;
  tags: $ReadOnlyArray<string>;
  searchSettings: SearchSettings;
  findProjectsArgs: FindProjectsArgs;
  filterApplied: boolean;
  projectsLoading: boolean;
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
        initialState = initialState.set('searchSettings', action.searchSettings || {updateUrl: false});
        return this._loadProjects(initialState, true);
      case 'ADD_TAG':
        state = state.set('filterApplied', true);
        return this._loadProjects(this._addTagToState(state, action.tag));
      case 'REMOVE_TAG':
        state = state.set('tags', state.tags.filter(tag => tag !== action.tag.tag_name));
        state = state.set('filterApplied', true);
        return this._loadProjects(state);
      case 'SET_KEYWORD':
        return this._loadProjects(this._addKeywordToState(state, action.keyword));
      case 'SET_SORT':
        return this._loadProjects(this._addSortFieldToState(state, action.sortField));
      case 'SET_LOCATION':
        return this._loadProjects(this._addLocationToState(state, action.location));
      case 'SET_PAGE':
        return this._loadProjects(this._setPageNumberInState(state, action.page));
      case 'CLEAR_FILTERS':
        return this._loadProjects(this._clearFilters(state));
      case 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        let projects = action.projectsResponse.projects.map(ProjectAPIUtils.projectFromAPIData);
        let numPages = action.projectsResponse.numPages;
        let numProjects = action.projectsResponse.numProjects;
        let allTags = _.mapKeys(action.projectsResponse.tags, (tag:TagDefinition) => tag.tag_name);
        // Remove all tag filters that don't match an existing tag name
        state = state.set('tags', state.tags.filter(tag => allTags[tag]));
        let currentProjects = state.projectsData.projects || List();
        state = state.set('projectsData', {
          projects: currentProjects.concat(projects),
          numPages: numPages,
          numProjects: numProjects,
          allTags: allTags,
        });
        return state.set('projectsLoading', false);
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
        location: locationRadiusToString(state.location),
        issues: this._getTagCategoryParams(state, TagCategory.ISSUES),
        tech: this._getTagCategoryParams(state, TagCategory.TECHNOLOGIES_USED),
        role: this._getTagCategoryParams(state, TagCategory.ROLE),
        org: this._getTagCategoryParams(state, TagCategory.ORGANIZATION),
        orgType: this._getTagCategoryParams(state, TagCategory.ORGANIZATION_TYPE),
        stage: this._getTagCategoryParams(state, TagCategory.PROJECT_STAGE),
        url: state.url,
        positions: state.positions
      }, _.identity);
      state = state.set('findProjectsArgs', findProjectsArgs);
    }

    return state;
  }

  _updateWindowUrl(state: State) {
    if(state.findProjectsArgs) {
      // Only show the FindProjects page args that users care about
      const urlArgs = _.omit(state.findProjectsArgs, ['page']);
      const windowUrl: string = urls.constructWithQueryString(urls.section(Section.FindProjects), urlArgs);
      history.pushState({}, null, windowUrl);
    }
  }

  _initializeFilters(state: State, findProjectsArgs: FindProjectsArgs): State {
    state = this._addTagFilters(state, findProjectsArgs.issues);
    state = this._addTagFilters(state, findProjectsArgs.role);
    state = this._addTagFilters(state, findProjectsArgs.tech);
    state = this._addTagFilters(state, findProjectsArgs.org);
    state = this._addTagFilters(state, findProjectsArgs.orgType);
    state = this._addTagFilters(state, findProjectsArgs.stage);
    state = this._addKeywordToState(state, findProjectsArgs.keyword);
    state = this._addSortFieldToState(state, findProjectsArgs.sortField);
    state = this._addLocationToState(state, locationRadiusFromString(findProjectsArgs.location));

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
    state = state.set('filterApplied', true);
    return state.set('tags', newTags);
  }

  _addKeywordToState(state: State, keyword: string): State {
    state = state.set('keyword', keyword);
    state = state.set('filterApplied', true);
    return state;
  }

  _addSortFieldToState(state: State, sortField: string): State {
    state = state.set('sortField', sortField);
    state = state.set('filterApplied', true);
    return state;
  }

  _addLocationToState(state: State, location: LocationRadius): State {
    state = state.set('location', location);
    state = state.set('filterApplied', true);
    return state;
  }

  _setPageNumberInState(state: State, page: number): State {
    state = state.set('page', page);
    return state;
  }

  _clearFilters(state: State): State {
    state = state.set('keyword', '');
    state = state.set('sortField', '');
    state = state.set('location', {});
    state = state.set('tags', List());
    state = state.set('page', 1);
    state = state.set('filterApplied', false);
    state = state.set('projectsData', {});
    state = state.set('findProjectsArgs', {page: 1});
    return state;
  }

  _loadProjects(state: State, noUpdateUrl: ?boolean): State {
    state = state.set('projectsLoading', true);
    state = this._updateFindProjectArgs(state);
    if (state.filterApplied) {
      state = state.set('page', 1);
      state = state.set('projectsData', {});
      state = state.set('filterApplied', false);
    }
    if(state.searchSettings.updateUrl && !noUpdateUrl) {
      this._updateWindowUrl(state);
    }
    const url: string = urls.constructWithQueryString(`/api/projects?page=${state.page}`,
      Object.assign({}, state.findProjectsArgs));
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse => 
        ProjectSearchDispatcher.dispatch({
          type: 'SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
          projectsResponse: getProjectsResponse
        })
      );
    return state;
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

  getLocation(): LocationRadius {
    return this.getState().location;
  }

  getProjects(): List<Project> {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.projects;
  }

  getProjectPages(): number {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.numPages;
  }

  getCurrentPage(): number {
    return this.getState().page;
  }

  getNumberOfProjects(): number {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.numProjects;
  }
  
  getProjectsLoading(): boolean {
    return this.getState().projectsLoading;
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
