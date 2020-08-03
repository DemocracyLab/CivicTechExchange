// @flow

import type {Tag} from './TagStore';

import {ReduceStore} from 'flux/utils';
import EventSearchDispatcher from "./EventSearchDispatcher.js";
import {SearchSettings, LocationRadius, locationRadiusToString, locationRadiusFromString} from "./ProjectSearchStore.js";
import {List, Record} from 'immutable'
import type {TagDefinition} from '../utils/ProjectAPIUtils.js';
import {EventTileAPIData} from "../utils/EventAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import urls from "../utils/url.js";
import Section from "../enums/Section.js";
import {CountryData, countryByCode} from "../constants/Countries.js";
import type {Dictionary} from "../types/Generics.jsx";
import _ from "lodash";

export type FindEventsArgs = {|
  keyword: string,
  sortField: string,
  locationRadius: string,
  page: number,
  issues: string,
|};

type FindEventsResponse = {|
  groups: $ReadOnlyArray<EventTileAPIData>,
  numPages: number,
  numEvents: number,
  tags: $ReadOnlyArray<TagDefinition>,
  availableCountries: $ReadOnlyArray<string>
|};

type FindEventsData = {|
  groups: $ReadOnlyArray<EventTileAPIData>,
  availableCountries: $ReadOnlyArray<string>,
  numPages: number,
  numEvents: number,
  allTags: Dictionary<TagDefinition>
|};



export type EventSearchActionType = {
  type: 'INIT',
  searchSettings: SearchSettings,
  findEventsArgs: FindEventsArgs
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
  groupsResponse: FindEventsResponse,
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
  findEventsArgs: {},
  filterApplied: false,
  groupsLoading: false
};

class State extends Record(DEFAULT_STATE) {
  keyword: string;
  sortField: string;
  locationRadius: LocationRadius;
  page: number;
  groupsData: FindEventsData;
  tags: $ReadOnlyArray<string>;
  searchSettings: SearchSettings;
  findEventsArgs: FindEventsArgs;
  filterApplied: boolean;
  groupsLoading: boolean;
}

class EventSearchStore extends ReduceStore<State> {
  constructor(): void {
    super(EventSearchDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: EventSearchActionType): State {
    switch (action.type) {
      case 'INIT':
        let initialState: State = new State();
        if(action.findEventsArgs) {
          initialState = this._initializeFilters(initialState, action.findEventsArgs);
        }
        initialState = initialState.set('findEventsArgs', action.findEventsArgs || {});
        initialState = initialState.set('searchSettings', action.searchSettings || {updateUrl: false});
        return this._loadEvents(initialState, true);
      case 'ADD_TAG':
        state = state.set('filterApplied', true);
        return this._loadEvents(this._addTagToState(state, action.tag));
      case 'REMOVE_TAG':
        state = state.set('tags', state.tags.filter(tag => tag !== action.tag.tag_name));
        state = state.set('filterApplied', true);
        return this._loadEvents(state);
      case 'SET_KEYWORD':
        return this._loadEvents(this._addKeywordToState(state, action.keyword));
      case 'SET_SORT':
        return this._loadEvents(this._addSortFieldToState(state, action.sortField));
      case 'SET_LOCATION':
        return this._loadEvents(this._addLocationToState(state, action.locationRadius));
      case 'SET_PAGE':
        return this._loadEvents(this._setPageNumberInState(state, action.page));
      case 'CLEAR_FILTERS':
        return this._loadEvents(this._clearFilters(state));
      case 'SET_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        let allTags = _.mapKeys(action.groupsResponse.tags, (tag:TagDefinition) => tag.tag_name);
        // Remove all tag filters that don't match an existing tag name
        state = state.set('tags', state.tags.filter(tag => allTags[tag]));
        let currentEvents = state.groupsData.groups || List();
        state = state.set('groupsData', {
          groups: currentEvents.concat(action.groupsResponse.groups),
          numPages: action.groupsResponse.numPages,
          numEvents: action.groupsResponse.numEvents,
          allTags: allTags,
          availableCountries: action.groupsResponse.availableCountries
        });
        return state.set('groupsLoading', false);
      default:
        (action: empty);
        return state;
    }
  }

  _updateFindEventsArgs(state: State): State {
    if(state.groupsData && state.groupsData.allTags) {
      const findEventsArgs: FindEventsArgs = _.pickBy({
        keyword: state.keyword,
        sortField: state.sortField,
        location: state.location,
        locationRadius: state.locationRadius && state.locationRadius.latitude && state.locationRadius.longitude && locationRadiusToString(state.locationRadius),
        issues: this._getTagCategoryParams(state, TagCategory.ISSUES),
        url: state.url,
      }, _.identity);
      state = state.set('findEventsArgs', findEventsArgs);
    }

    return state;
  }

  _updateWindowUrl(state: State) {
    if(state.findEventsArgs) {
      // Only show the FindEvents page args that users care about
      const urlArgs = _.omit(state.findEventsArgs, ['page']);
      const windowUrl: string = urls.constructWithQueryString(urls.section(Section.FindEvents), urlArgs);
      history.pushState({}, null, windowUrl);
    }
  }

  _initializeFilters(state: State, findEventsArgs: FindEventsArgs): State {
    state = this._addTagFilters(state, findEventsArgs.issues);
    state = this._addKeywordToState(state, findEventsArgs.keyword);
    state = this._addSortFieldToState(state, findEventsArgs.sortField);
    state = this._addLocationToState(state, locationRadiusFromString(findEventsArgs.locationRadius));

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
    state = state.set('findEventsArgs', {page: 1});
    return state;
  }

  _loadEvents(state: State, noUpdateUrl: ?boolean): State {
    state = state.set('groupsLoading', true);
    state = this._updateFindEventsArgs(state);
    if (state.filterApplied) {
      state = state.set('page', 1);
      state = state.set('groupsData', {});
      state = state.set('filterApplied', false);
    }
    if(state.searchSettings.updateUrl && !noUpdateUrl) {
      this._updateWindowUrl(state);
    }
    const url: string = urls.constructWithQueryString(`/api/groups?page=${state.page}`,
      Object.assign({}, state.findEventsArgs));
    fetch(new Request(url))
      .then(response => response.json())
      .then( (findEventsResponse: FindEventsResponse ) =>
        EventSearchDispatcher.dispatch({
          type: 'SET_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE',
          groupsResponse: findEventsResponse
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
    const groupsData: FindEventsData = this.getState().groupsData;
    return groupsData && groupsData.availableCountries && groupsData.availableCountries.map(countryByCode);
  }

  getLocation(): LocationRadius {
    return this.getState().locationRadius;
  }

  getEvents(): List<EventTileAPIData> {
    const state: State = this.getState();
    return state.groupsData && state.groupsData.groups;
  }

  getEventPages(): number {
    const state: State = this.getState();
    return state.groupsData && state.groupsData.numPages;
  }

  getCurrentPage(): number {
    return this.getState().page;
  }

  getNumberOfEvents(): number {
    const state: State = this.getState();
    return state.groupsData && state.groupsData.numEvents;
  }

  getEventsLoading(): boolean {
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

export default new EventSearchStore();
