// @flow

import type { Tag } from "./TagStore";

import { ReduceStore } from "flux/utils";
import UniversalDispatcher from "./UniversalDispatcher.js";
import { List, Record } from "immutable";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";
import type {
  ProjectData,
  TagDefinition,
  TagDefinitionCount,
  ProjectAPIData
} from "../utils/ProjectAPIUtils.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import urls from "../utils/url.js";
import Section from "../enums/Section.js";
import { CountryData, countryByCode } from "../constants/Countries.js";
import { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

export type SearchSettings = {|
  updateUrl: boolean,
  defaultSort: string
|};

export type FindProjectsArgs = {|
  keyword: string,
  sortField: string,
  location: string,
  locationRadius: string,
  page: number,
  issues: string,
  tech: string,
  role: string,
  org: string,
  orgType: string,
  stage: string,
  url: string,
  event_id: number,
  group_id: number,
  favoritesOnly: boolean,
  error: boolean
|};

type FindProjectsResponse = {|
  +projects: $ReadOnlyArray<ProjectAPIData>,
  +numPages: number,
  +numProjects: number,
  +tags: Dictionary<TagDefinition>,
  +availableCountries: $ReadOnlyArray<string>
|};

type FindProjectsData = {|
  +projects: $ReadOnlyArray<ProjectData>,
  +availableCountries: $ReadOnlyArray<string>,
  +numPages: number,
  +numProjects: number,
  +tags: Dictionary<TagDefinition>
|};

export type LocationRadius = {|
  latitude: number,
  longitude: number,
  radius: number
|};

export function locationRadiusToString(locationRadius: LocationRadius): string {
  return `${locationRadius.latitude},${locationRadius.longitude},${locationRadius.radius}`;
}

export function locationRadiusFromString(str: string): LocationRadius {
  const parts: $ReadOnlyArray<string> = str && str.split(",");
  return (
    parts &&
    parts.length > 2 && {
      latitude: parseFloat(parts[0]),
      longitude: parseFloat(parts[1]),
      radius: parseInt(parts[2])
    }
  );
}

export type ProjectSearchActionType =
  | {
      type: "INIT_PROJECT_SEARCH",
      searchSettings: SearchSettings,
      findProjectsArgs: FindProjectsArgs
    }
  | {
      type: "ADD_TAG",
      tag: Tag
    }
  | {
      type: "REMOVE_TAG",
      tag: Tag
    }
  | {
      type: "SET_KEYWORD",
      keyword: string
    }
  | {
      type: "SET_SORT",
      sortField: string
    }
  | {
      type: "UNSET_LEGACY_LOCATION"
    }
  | {
      type: "ERROR"
    }
  | {
      type: "SET_LOCATION",
      locationRadius: ?LocationRadius
    }
  | {
      type: "SET_PAGE",
      page: number
    }
  | {
      type: "SET_FAVORITES_ONLY",
      favoritesOnly: boolean
    }
  | {
      type: "CLEAR_FILTERS"
    }
  | {
      type: "SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE",
      projectsResponse: FindProjectsResponse
    };

const defaultSort = "-project_date_modified";

const DEFAULT_STATE = {
  keyword: "",
  sortField: "",
  location: "",
  locationRadius: null,
  page: 1,
  favoritesOnly: false,
  tags: List(),
  projectsData: {},
  searchSettings: {
    updateUrl: false,
    defaultSort: defaultSort
  },
  findProjectsArgs: {},
  filterApplied: false,
  projectsLoading: false,
  error: false
};

class State extends Record(DEFAULT_STATE) {
  keyword: string;
  sortField: string;
  location: string;
  locationRadius: LocationRadius;
  page: number;
  favoritesOnly: boolean;
  projectsData: FindProjectsData;
  tags: $ReadOnlyArray<string>;
  searchSettings: SearchSettings;
  findProjectsArgs: FindProjectsArgs;
  filterApplied: boolean;
  projectsLoading: boolean;
  error: boolean;
}

class ProjectSearchStore extends ReduceStore<State> {
  constructor(): void {
    super(UniversalDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: ProjectSearchActionType): State {
    switch (action.type) {
      case "INIT_PROJECT_SEARCH":
        let initialState: State = new State();
        if (action.findProjectsArgs) {
          initialState = this._initializeFilters(
            initialState,
            action.findProjectsArgs
          );
        }
        initialState = initialState.set(
          "findProjectsArgs",
          action.findProjectsArgs || {}
        );
        initialState = initialState.set(
          "searchSettings",
          action.searchSettings || {
            updateUrl: false,
            defaultSort: defaultSort
          }
        );
        return this._loadProjects(initialState, true);
      case "ERROR":
        state = state.set("error", true);
        return state;
      case "ADD_TAG":
        state = state.set("filterApplied", true);
        return this._loadProjects(this._addTagToState(state, action.tag));
      case "REMOVE_TAG":
        state = state.set(
          "tags",
          state.tags.filter(tag => tag !== action.tag.tag_name)
        );
        state = state.set("filterApplied", true);
        return this._loadProjects(state);
      case "SET_KEYWORD":
        return this._loadProjects(
          this._addKeywordToState(state, action.keyword)
        );
      case "SET_SORT":
        return this._loadProjects(
          this._addSortFieldToState(state, action.sortField)
        );
      case "SET_LOCATION":
        return this._loadProjects(
          this._addLocationToState(state, action.locationRadius)
        );
      case "UNSET_LEGACY_LOCATION":
        return this._loadProjects(this._addLegacyLocationToState(state, null));
      case "SET_PAGE":
        return this._loadProjects(
          this._setPageNumberInState(state, action.page)
        );
      case "SET_FAVORITES_ONLY":
        return this._loadProjects(
          this._addFavoritesOnlyToState(state, action.favoritesOnly)
        );
      case "CLEAR_FILTERS":
        return this._loadProjects(this._clearFilters(state));
      case "SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE":
        let projects = action.projectsResponse.projects.map(
          ProjectAPIUtils.projectFromAPIData
        );
        let numPages = action.projectsResponse.numPages;
        let numProjects = action.projectsResponse.numProjects;
        let availableCountries = action.projectsResponse.availableCountries;
        let allTags = _.mapKeys(
          action.projectsResponse.tags,
          (tag: TagDefinition) => tag.tag_name
        );
        // Remove all tag filters that don't match an existing tag name
        state = state.set(
          "tags",
          state.tags.filter(tag => allTags[tag])
        );
        state = state.set("error", false);
        let currentProjects = state.projectsData.projects || List();
        state = state.set("projectsData", {
          projects: currentProjects.concat(projects),
          numPages: numPages,
          numProjects: numProjects,
          allTags: allTags,
          availableCountries: availableCountries
        });
        return state.set("projectsLoading", false);
      default:
        (action: empty);
        return state;
    }
  }

  _updateFindProjectArgs(state: State): State {
    const oldArgs: FindProjectsArgs = state.findProjectsArgs;
    if (state.projectsData && state.projectsData.allTags) {
      const findProjectsArgs: FindProjectsArgs = _.pickBy(
        {
          keyword: state.keyword,
          sortField: state.sortField,
          location: state.location,
          locationRadius:
            state.locationRadius &&
            state.locationRadius.latitude &&
            state.locationRadius.longitude &&
            locationRadiusToString(state.locationRadius),
          issues: this._getTagCategoryParams(state, TagCategory.ISSUES),
          tech: this._getTagCategoryParams(
            state,
            TagCategory.TECHNOLOGIES_USED
          ),
          role: this._getTagCategoryParams(state, TagCategory.ROLE),
          org: this._getTagCategoryParams(state, TagCategory.ORGANIZATION),
          orgType: this._getTagCategoryParams(
            state,
            TagCategory.ORGANIZATION_TYPE
          ),
          stage: this._getTagCategoryParams(state, TagCategory.PROJECT_STAGE),
          url: state.url,
          positions: state.positions,
          event_id: oldArgs.event_id,
          group_id: oldArgs.group_id,
          favoritesOnly: state.favoritesOnly
        },
        _.identity
      );
      state = state.set("findProjectsArgs", findProjectsArgs);
    }

    return state;
  }

  _updateWindowUrl(state: State) {
    if (state.findProjectsArgs) {
      // Only show the FindProjects page args that users care about
      const urlArgs = _.omit(state.findProjectsArgs, ["page"]);
      const windowUrl: string = urls.constructWithQueryString(
        urls.section(Section.FindProjects),
        urlArgs
      );
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
    state = this._addLocationToState(
      state,
      locationRadiusFromString(findProjectsArgs.locationRadius)
    );
    state = this._addLegacyLocationToState(state, findProjectsArgs.location);
    state = this._addFavoritesOnlyToState(
      state,
      findProjectsArgs.favoritesOnly
    );

    return state;
  }

  _addTagFilters(state: State, filter: string): State {
    if (filter) {
      filter.split(",").forEach(tag => {
        state = this._addTagToState(state, tag);
      });
    }
    return state;
  }

  _addTagToState(state: State, tag: string): State {
    const newTags: $ReadOnlyArray<string> = state.tags.concat(tag);
    state = state.set("filterApplied", true);
    return state.set("tags", newTags);
  }

  _addKeywordToState(state: State, keyword: string): State {
    state = state.set("keyword", keyword);
    state = state.set("filterApplied", true);
    return state;
  }

  _addSortFieldToState(state: State, sortField: string): State {
    state = state.set("sortField", sortField);
    state = state.set("filterApplied", true);
    return state;
  }

  _addLegacyLocationToState(state: State, location: ?string): State {
    state = state.set("location", location);
    state = state.set("filterApplied", true);
    return state;
  }

  _addLocationToState(state: State, locationRadius: LocationRadius): State {
    state = state.set("locationRadius", locationRadius);
    state = state.set("filterApplied", true);
    return state;
  }

  _setPageNumberInState(state: State, page: number): State {
    state = state.set("page", page);
    return state;
  }

  _addFavoritesOnlyToState(state: State, favoritesOnly: boolean): State {
    state = state.set("filterApplied", true);
    return state.set("favoritesOnly", favoritesOnly);
  }

  _clearFilters(state: State): State {
    state = state.set("keyword", "");
    state = state.set("sortField", state.searchSettings.defaultSort);
    state = state.set("location", "");
    state = state.set("locationRadius", {});
    state = state.set("tags", List());
    state = state.set("page", 1);
    state = state.set("favoritesOnly", false);
    state = state.set("filterApplied", false);
    state = state.set("projectsData", {});
    const findProjectsArgs: FindProjectsArgs = _.pick(state.findProjectsArgs, [
      "event_id",
      "group_id"
    ]);
    state = state.set(
      "findProjectsArgs",
      Object.assign(findProjectsArgs, {
        page: 1,
        sortField: state.searchSettings.defaultSort
      })
    );
    return state;
  }

  _loadProjects(state: State, noUpdateUrl: ?boolean): State {
    state = state.set("projectsLoading", true);
    state = this._updateFindProjectArgs(state);
    if (state.filterApplied) {
      state = state.set("page", 1);
      state = state.set("projectsData", {});
      state = state.set("filterApplied", false);
    }
    if (state.searchSettings.updateUrl && !noUpdateUrl) {
      this._updateWindowUrl(state);
    }
    const url: string = urls.constructWithQueryString(
      `/api/projects?page=${state.page}`,
      Object.assign({}, state.findProjectsArgs)
    );
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse =>
        UniversalDispatcher.dispatch({
          type: "SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE",
          projectsResponse: getProjectsResponse
        })
      )
      .catch(error => {
        UniversalDispatcher.dispatch({
          type: "ERROR"
        });
      });
    return state;
  }

  _getTagCategoryParams(state: State, category: string): ?string {
    const tags = this.getTags(state).filter(tag => tag.category === category);
    return tags.map(tag => tag.tag_name).join(",");
  }

  getError(): boolean {
    return this.getState().error;
  }

  getKeyword(): string {
    return this.getState().keyword;
  }

  getDefaultSortField(): string {
    return this.getState().searchSettings.defaultSort;
  }

  getSortField(): string {
    return this.getState().sortField;
  }

  getCountryList(): $ReadOnlyArray<CountryData> {
    const projectData: FindProjectsData = this.getState().projectsData;
    let countryList =
      projectData &&
      projectData.availableCountries &&
      projectData.availableCountries.map(countryByCode);
    return countryList && _.sortBy(countryList, "displayName");
  }

  getLocation(): LocationRadius {
    return this.getState().locationRadius;
  }

  getLegacyLocation(): string {
    return this.getState().location;
  }

  getProjects(): List<ProjectData> {
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

  getFavoritesOnly(): boolean {
    return this.getState().favoritesOnly;
  }

  getNumberOfProjects(): number {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.numProjects;
  }

  getProjectsLoading(): boolean {
    return this.getState().projectsLoading;
  }

  getAllTags(): Dictionary<TagDefinitionCount> {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.allTags;
  }

  getTags(inProgressState: ?State): List<TagDefinition> {
    const state: State = inProgressState || this.getState();
    if (state.projectsData && state.projectsData.allTags && state.tags) {
      return List(state.tags.map(tag => state.projectsData.allTags[tag]));
    } else {
      return List();
    }
  }

  getQueryString(): string {
    const state: State = this.getState();
    return urls.constructWithQueryString(
      `projects`,
      state.findProjectsArgs || {}
    );
  }
}

export default new ProjectSearchStore();
