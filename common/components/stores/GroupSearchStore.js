// @flow

import type {Tag} from './TagStore';

import {ReduceStore} from 'flux/utils';
import GroupSearchDispatcher from "./GroupSearchDispatcher.js";
import {SearchSettings, LocationRadius} from "./ProjectSearchStore.js";
import {List, Record} from 'immutable'
import type {TagDefinition} from '../utils/ProjectAPIUtils.js';
import {GroupTileAPIData} from "../utils/GroupAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import urls from "../utils/url.js";
import Section from "../enums/Section.js";
import {CountryData, countryByCode} from "../constants/Countries.js";
import type {Dictionary} from "../types/Generics.jsx";
import _ from "lodash";

export type FindGroupsArgs = {|
  keyword: string,
  sortField: string,
  locationRadius: string,
  page: number,
  issues: string,
|};

type FindGroupsResponse = {|
  groups: $ReadOnlyArray<GroupTileAPIData>,
  numPages: number,
  numGroups: number,
  tags: $ReadOnlyArray<TagDefinition>,
  availableCountries: $ReadOnlyArray<string>
|};

type FindGroupsData = {|
  groups: $ReadOnlyArray<GroupTileAPIData>,
  availableCountries: $ReadOnlyArray<string>,
  numPages: number,
  numGroups: number,
  allTags: Dictionary<TagDefinition>
|};



export type GroupSearchActionType = {
  type: 'INIT',
  searchSettings: SearchSettings,
  findGroupsArgs: FindGroupsArgs
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
  locationRadius: ?LocationRadius
} | {
  type: 'SET_PAGE',
  page: number,
} | {
  type: 'CLEAR_FILTERS',
} | {
  type: 'SET_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE',
  groupsResponse: FindGroupsResponse,
};

const DEFAULT_STATE = {
  keyword: '',
  sortField: '',
  locationRadius: null,
  page: 1,
  tags: List(),
  allTags: {},
  groupsData: {},
  searchSettings: {
    updateUrl: false
  },
  findGroupsArgs: {},
  filterApplied: false,
  groupsLoading: false
};

class State extends Record(DEFAULT_STATE) {
  keyword: string;
  sortField: string;
  locationRadius: LocationRadius;
  page: number;
  groupsData: FindGroupsData;
  tags: $ReadOnlyArray<string>;
  searchSettings: SearchSettings;
  findGroupsArgs: FindGroupsArgs;
  filterApplied: boolean;
  groupsLoading: boolean;
}

class GroupSearchStore extends ReduceStore<State> {
  constructor(): void {
    super(GroupSearchDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: GroupSearchActionType): State {
    switch (action.type) {
      case 'INIT':
        let initialState: State = new State();
        if(action.findGroupsArgs) {
          initialState = this._initializeFilters(initialState, action.findGroupsArgs);
        }
        initialState = initialState.set('findGroupsArgs', action.findGroupsArgs || {});
        initialState = initialState.set('searchSettings', action.searchSettings || {updateUrl: false});
        return this._loadGroups(initialState, true);
      case 'ADD_TAG':
        state = state.set('filterApplied', true);
        return this._loadGroups(this._addTagToState(state, action.tag));
      case 'REMOVE_TAG':
        state = state.set('tags', state.tags.filter(tag => tag !== action.tag.tag_name));
        state = state.set('filterApplied', true);
        return this._loadGroups(state);
      case 'SET_KEYWORD':
        return this._loadGroups(this._addKeywordToState(state, action.keyword));
      case 'SET_SORT':
        return this._loadGroups(this._addSortFieldToState(state, action.sortField));
      case 'SET_LOCATION':
        return this._loadGroups(this._addLocationToState(state, action.locationRadius));
      case 'SET_PAGE':
        return this._loadGroups(this._setPageNumberInState(state, action.page));
      case 'CLEAR_FILTERS':
        return this._loadGroups(this._clearFilters(state));
      case 'SET_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        let allTags = _.mapKeys(action.groupsResponse.tags, (tag:TagDefinition) => tag.tag_name);
        // Remove all tag filters that don't match an existing tag name
        state = state.set('tags', state.tags.filter(tag => allTags[tag]));
        let currentGroups = state.groupsData.groups || List();
        state = state.set('groupsData', {
          groups: currentGroups.concat(action.groupsResponse.groups),
          numPages: action.groupsResponse.numPages,
          numGroups: state.groupsData.numGroups,
          allTags: allTags,
          availableCountries: action.groupsResponse.availableCountries
        });
        return state.set('groupsLoading', false);
      default:
        (action: empty);
        return state;
    }
  }

  _updateFindGroupsArgs(state: State): State {
    if(state.groupsData && state.groupsData.allTags) {
      const findGroupsArgs: FindGroupsArgs = _.pickBy({
        keyword: state.keyword,
        sortField: state.sortField,
        location: state.location,
        locationRadius: state.locationRadius && state.locationRadius.latitude && state.locationRadius.longitude && locationRadiusToString(state.locationRadius),
        issues: this._getTagCategoryParams(state, TagCategory.ISSUES),
        url: state.url,
      }, _.identity);
      state = state.set('findGroupsArgs', findGroupsArgs);
    }

    return state;
  }

  _updateWindowUrl(state: State) {
    if(state.findGroupsArgs) {
      // Only show the FindGroups page args that users care about
      const urlArgs = _.omit(state.findGroupsArgs, ['page']);
      const windowUrl: string = urls.constructWithQueryString(urls.section(Section.FindGroups), urlArgs);
      history.pushState({}, null, windowUrl);
    }
  }

  _initializeFilters(state: State, findGroupsArgs: FindGroupsArgs): State {
    state = this._addTagFilters(state, findGroupsArgs.issues);
    state = this._addKeywordToState(state, findGroupsArgs.keyword);
    state = this._addSortFieldToState(state, findGroupsArgs.sortField);
    state = this._addLocationToState(state, locationRadiusFromString(findGroupsArgs.locationRadius));

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

  _addLocationToState(state: State, locationRadius: LocationRadius): State {
    state = state.set('locationRadius', locationRadius);
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
    state = state.set('locationRadius', {});
    state = state.set('tags', List());
    state = state.set('page', 1);
    state = state.set('filterApplied', false);
    state = state.set('groupsData', {});
    state = state.set('findGroupsArgs', {page: 1});
    return state;
  }

  _loadGroups(state: State, noUpdateUrl: ?boolean): State {
    state = state.set('groupsLoading', true);
    state = this._updateFindGroupsArgs(state);
    if (state.filterApplied) {
      state = state.set('page', 1);
      state = state.set('groupsData', {});
      state = state.set('filterApplied', false);
    }
    if(state.searchSettings.updateUrl && !noUpdateUrl) {
      this._updateWindowUrl(state);
    }
    const url: string = urls.constructWithQueryString(`/api/groups?page=${state.page}`,
      Object.assign({}, state.findGroupsArgs));
    fetch(new Request(url))
      .then(response => response.json())
      .then( (findGroupsResponse: FindGroupsResponse ) =>
        GroupSearchDispatcher.dispatch({
          type: 'SET_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE',
          groupsResponse: findGroupsResponse
        })
      );
    return state;
  }

  _getTagCategoryParams(state: State, category: string): ?string {
    const tags = this.getSelectedTags(state).filter(tag => tag.category === category);
    return tags.map(tag => tag.tag_name).join(',');
  }

  getKeyword(): string {
    return this.getState().keyword;
  }

  getSortField(): string {
    return this.getState().sortField;
  }
  
  getCountryList(): $ReadOnlyArray<CountryData> {
    const groupsData: FindGroupsData = this.getState().groupsData;
    return groupsData && groupsData.availableCountries && groupsData.availableCountries.map(countryByCode);
  }

  getLocation(): LocationRadius {
    return this.getState().locationRadius;
  }

  getGroups(): List<GroupTileAPIData> {
    const state: State = this.getState();
    return state.groupsData && state.groupsData.groups;
  }

  getGroupPages(): number {
    const state: State = this.getState();
    return state.groupsData && state.groupsData.numPages;
  }

  getCurrentPage(): number {
    return this.getState().page;
  }

  getNumberOfGroups(): number {
    const state: State = this.getState();
    return state.groupsData && state.groupsData.numGroups;
  }
  
  getGroupsLoading(): boolean {
    return this.getState().groupsLoading;
  }
  
  getAllTags(): Dictionary<TagDefinition> {
    const state: State = this.getState();
    return state.groupsData && state.groupsData.allTags;
  }

  getSelectedTags(inProgressState: ?State): List<TagDefinition> {
    const state: State = inProgressState || this.getState();
    if(state.groupsData && state.groupsData.allTags && state.tags) {
      return List(state.tags.map(tag => state.groupsData.allTags[tag]));
    } else {
      return List();
    }
  }
}

export default new GroupSearchStore();
