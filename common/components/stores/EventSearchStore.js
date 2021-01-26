// @flow

import type { Tag } from "./TagStore";

import { ReduceStore } from "flux/utils";
import EventSearchDispatcher from "./EventSearchDispatcher.js";
import {
  SearchSettings,
  LocationRadius,
  locationRadiusToString,
  locationRadiusFromString,
} from "./ProjectSearchStore.js";
import { List, Record } from "immutable";
import type { TagDefinition } from "../utils/ProjectAPIUtils.js";
import { EventTileAPIData } from "../utils/EventAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import urls from "../utils/url.js";
import Section from "../enums/Section.js";
import { CountryData, countryByCode } from "../constants/Countries.js";
import type { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

export type FindEventsArgs = {|
  keyword: string,
  dateRangeStart: string,
  dateRangeEnd: string,
  page: number,
|};

type FindEventsResponse = {|
  events: $ReadOnlyArray<EventTileAPIData>,
  numPages: number,
  numEvents: number,
|};

type FindEventsData = {|
  events: $ReadOnlyArray<EventTileAPIData>,
  availableCountries: $ReadOnlyArray<string>,
  numPages: number,
  numEvents: number,
  allTags: Dictionary<TagDefinition>,
|};

export type EventSearchActionType =
  | {
      type: "INIT",
      searchSettings: SearchSettings,
      findEventsArgs: FindEventsArgs,
    }
  | {
      type: "SET_KEYWORD",
      keyword: string,
    }
  | {
      type: "SET_PAGE",
      page: number,
    }
  | {
      type: "CLEAR_FILTERS",
    }
  | {
      type: "SET_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE",
      eventsResponse: FindEventsResponse,
    };

const DEFAULT_STATE = {
  keyword: "",
  sortField: "",
  locationRadius: null,
  page: 1,
  tags: List(),
  allTags: {},
  eventsData: {},
  searchSettings: {
    updateUrl: false,
  },
  findEventsArgs: {},
  filterApplied: false,
  eventsLoading: false,
};

class State extends Record(DEFAULT_STATE) {
  keyword: string;
  sortField: string;
  locationRadius: LocationRadius;
  page: number;
  eventsData: FindEventsData;
  tags: $ReadOnlyArray<string>;
  searchSettings: SearchSettings;
  findEventsArgs: FindEventsArgs;
  filterApplied: boolean;
  eventsLoading: boolean;
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
      case "INIT":
        let initialState: State = new State();
        if (action.findEventsArgs) {
          initialState = this._initializeFilters(
            initialState,
            action.findEventsArgs
          );
        }
        initialState = initialState.set(
          "findEventsArgs",
          action.findEventsArgs || {}
        );
        initialState = initialState.set(
          "searchSettings",
          action.searchSettings || { updateUrl: false }
        );
        return this._loadEvents(initialState, true);
      case "SET_KEYWORD":
        return this._loadEvents(this._addKeywordToState(state, action.keyword));
      case "SET_PAGE":
        return this._loadEvents(this._setPageNumberInState(state, action.page));
      case "CLEAR_FILTERS":
        return this._loadEvents(this._clearFilters(state));
      case "SET_EVENTS_DO_NOT_CALL_OUTSIDE_OF_STORE":
        // Remove all tag filters that don't match an existing tag name
        let currentEvents = state.eventsData.events || List();
        state = state.set("eventsData", {
          events: currentEvents.concat(action.eventsResponse.events),
          numPages: action.eventsResponse.numPages,
          numEvents: action.eventsResponse.numEvents,
        });
        return state.set("eventsLoading", false);
      default:
        (action: empty);
        return state;
    }
  }

  _updateFindEventsArgs(state: State): State {
    if (state.eventsData && state.eventsData.allTags) {
      const findEventsArgs: FindEventsArgs = _.pickBy(
        {
          keyword: state.keyword,
          url: state.url,
        },
        _.identity
      );
      state = state.set("findEventsArgs", findEventsArgs);
    }

    return state;
  }

  _updateWindowUrl(state: State) {
    if (state.findEventsArgs) {
      // Only show the FindEvents page args that users care about
      const urlArgs = _.omit(state.findEventsArgs, ["page"]);
      const windowUrl: string = urls.constructWithQueryString(
        urls.section(Section.FindEvents),
        urlArgs
      );
      history.pushState({}, null, windowUrl);
    }
  }

  _initializeFilters(state: State, findEventsArgs: FindEventsArgs): State {
    state = this._addKeywordToState(state, findEventsArgs.keyword);
    state = this._addSortFieldToState(state, findEventsArgs.sortField);
    state = this._addLocationToState(
      state,
      locationRadiusFromString(findEventsArgs.locationRadius)
    );

    return state;
  }

  _addKeywordToState(state: State, keyword: string): State {
    state = state.set("keyword", keyword);
    state = state.set("filterApplied", true);
    return state;
  }

  _setPageNumberInState(state: State, page: number): State {
    state = state.set("page", page);
    return state;
  }

  _clearFilters(state: State): State {
    state = state.set("keyword", "");
    state = state.set("page", 1);
    state = state.set("filterApplied", false);
    state = state.set("eventsData", {});
    state = state.set("findEventsArgs", { page: 1 });
    return state;
  }

  _loadEvents(state: State, noUpdateUrl: ?boolean): State {
    state = state.set("eventsLoading", true);
    state = this._updateFindEventsArgs(state);
    if (state.filterApplied) {
      state = state.set("page", 1);
      state = state.set("eventsData", {});
      state = state.set("filterApplied", false);
    }
    if (state.searchSettings.updateUrl && !noUpdateUrl) {
      this._updateWindowUrl(state);
    }
    const url: string = urls.constructWithQueryString(
      `/api/events`,
      Object.assign({}, state.findEventsArgs)
    );
    fetch(new Request(url))
      .then(response => response.json())
      .then((findEventsResponse: FindEventsResponse) =>
        EventSearchDispatcher.dispatch({
          type: "SET_EVENTS_DO_NOT_CALL_OUTSIDE_OF_STORE",
          eventsResponse: findEventsResponse,
        })
      );
    return state;
  }

  getKeyword(): string {
    return this.getState().keyword;
  }

  getEvents(): List<EventTileAPIData> {
    const state: State = this.getState();
    return state.eventsData && state.eventsData.events;
  }

  getEventPages(): number {
    const state: State = this.getState();
    return state.eventsData && state.eventsData.numPages;
  }

  getCurrentPage(): number {
    return this.getState().page;
  }

  getNumberOfEvents(): number {
    const state: State = this.getState();
    return state.eventsData && state.eventsData.numEvents;
  }

  getEventsLoading(): boolean {
    return this.getState().eventsLoading;
  }
}

export default new EventSearchStore();
