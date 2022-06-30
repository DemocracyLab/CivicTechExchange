// @flow

import _ from "lodash";
import { ReduceStore } from "flux/utils";
import { List, Record } from "immutable";
import UniversalDispatcher from "./UniversalDispatcher.js";
import ProjectAPIUtils, {
  ProjectData,
  TagDefinition,
  TagDefinitionCount,
  ProjectAPIData,
  CardOperation,
} from "../utils/ProjectAPIUtils.js";
import {
  LocationRadius,
  locationRadiusToString,
  locationRadiusFromString,
} from "../common/location/LocationRadius.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import urls from "../utils/url.js";
import Section from "../enums/Section.js";
import { CountryData, countryByCode } from "../constants/Countries.js";
import { Dictionary } from "../types/Generics.jsx";
import { SelectOption } from "../types/SelectOption.jsx";

export type Tag = {|
  +caption: string,
  +category: string,
  +displayName: string,
  +id: number,
  +parent: string,
  +subcategory: string,
  +tagName: string,
|};

type EntityPayload<T> = {|
  entities: List<T>,
  entityCt: number,
|};

export type EntitySearchConfig<T> = {|
  name: string,
  apiUrlBase: string,
  apiEntityTransform: (any, SearchSettings) => EntityPayload<T>,
  defaultSort: string,
  sortFields: $ReadOnlyArray<SelectOption>,
|};

export const SearchFor: Dictionary<EntitySearchConfig> = {
  Projects: {
    name: "Projects",
    apiUrlBase: "/api/projects",
    apiEntityTransform: (apiResponse, searchSettings: SearchSettings) => {
      let projects = apiResponse.projects.map(
        ProjectAPIUtils.projectFromAPIData
      );
      if (searchSettings.cardOperationGenerator) {
        projects.forEach((project: ProjectData) => {
          project.cardOperation = state.searchSettings.cardOperationGenerator(
            project
          );
        });
      }
      return {
        entities: projects,
        entityCt: apiResponse.numProjects,
      };
    },
    defaultSort: "-project_date_modified",
    sortFields: [
      { value: "-project_date_modified", label: "Date Modified" },
      { value: "project_name", label: "Name - Ascending" },
      { value: "-project_name", label: "Name - Descending" },
    ],
  },
  Groups: {
    name: "Groups",
    apiUrlBase: "/api/groups",
    apiEntityTransform: apiResponse => {
      return {
        entities: apiResponse.groups,
        entityCt: apiResponse.numGroups,
      };
    },
    defaultSort: "",
    sortFields: [
      { value: "", label: "Name - Ascending" },
      { value: "-group_name", label: "Name - Descending" },
      { value: "-group_date_modified", label: "Date Modified" },
    ],
  },
  Events: {
    name: "Events",
    apiUrlBase: "/api/events",
    apiEntityTransform: apiResponse => {
      return {
        entities: apiResponse.events,
        entityCt: apiResponse.numEvents,
      };
    },
    defaultSort: "",
    sortFields: [
      { value: "", label: "Date Modified" },
      { value: "event_name", label: "Name - Ascending" },
      { value: "-event_name", label: "Name - Descending" },
    ],
  },
};

export type SearchSettings = {|
  searchConfig: EntitySearchConfig,
  updateUrl: boolean,
  cardOperationGenerator: ProjectData => CardOperation,
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
  error: boolean,
|};

type FindProjectsResponse = {|
  +projects: $ReadOnlyArray<ProjectAPIData>,
  +numPages: number,
  +numProjects: number,
  +tags: Dictionary<TagDefinition>,
  +availableCountries: $ReadOnlyArray<string>,
|};

type FindProjectsData = {|
  +projects: $ReadOnlyArray<ProjectData>,
  +availableCountries: $ReadOnlyArray<string>,
  +numPages: number,
  +numProjects: number,
  +tags: Dictionary<TagDefinition>,
|};

export type EntitySearchActionType =
  | {
      type: "INIT_SEARCH",
      searchSettings: SearchSettings,
      findProjectsArgs: FindProjectsArgs,
    }
  | {
      type: "ADD_TAG",
      tag: Tag,
    }
  | {
      type: "REMOVE_TAG",
      tag: Tag,
    }
  | {
      type: "SET_KEYWORD",
      keyword: string,
    }
  | {
      type: "SET_SORT",
      sortField: string,
    }
  | {
      type: "UNSET_LEGACY_LOCATION",
    }
  | {
      type: "ERROR",
    }
  | {
      type: "SET_LOCATION",
      locationRadius: ?LocationRadius,
    }
  | {
      type: "SET_PAGE",
      page: number,
    }
  | {
      type: "SET_FAVORITES_ONLY",
      favoritesOnly: boolean,
    }
  | {
      type: "CLEAR_FILTERS",
    }
  | {
      type: "SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE",
      projectsResponse: FindProjectsResponse,
    };

const defaultSort = "";

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
    defaultSort: defaultSort,
  },
  findProjectsArgs: {},
  filterApplied: false,
  projectsLoading: false,
  error: false,
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

class EntitySearchStore extends ReduceStore<State> {
  constructor(): void {
    super(UniversalDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: EntitySearchActionType): State {
    switch (action.type) {
      case "INIT_SEARCH":
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
            defaultSort: "",
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
        let entityPayload: EntityPayload = state.searchSettings.searchConfig.apiEntityTransform(
          action.projectsResponse,
          state.searchSettings
        );
        let numPages = action.projectsResponse.numPages;
        let numProjects = entityPayload.entityCt;
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
          projects: currentProjects.concat(entityPayload.entities),
          numPages: numPages,
          numProjects: numProjects,
          allTags: allTags,
          availableCountries: availableCountries,
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
          favoritesOnly: state.favoritesOnly,
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
    state = state.set(
      "sortField",
      state.searchSettings.searchConfig.defaultSort
    );
    state = state.set("location", "");
    state = state.set("locationRadius", {});
    state = state.set("tags", List());
    state = state.set("page", 1);
    state = state.set("favoritesOnly", false);
    state = state.set("filterApplied", false);
    state = state.set("projectsData", {});
    const findProjectsArgs: FindProjectsArgs = _.pick(state.findProjectsArgs, [
      "event_id",
      "group_id",
    ]);
    state = state.set(
      "findProjectsArgs",
      Object.assign(findProjectsArgs, {
        page: 1,
        sortField: state.searchSettings.searchConfig.defaultSort,
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
      `${state.searchSettings.searchConfig.apiUrlBase}?page=${state.page}`,
      Object.assign({}, state.findProjectsArgs)
    );
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse =>
        UniversalDispatcher.dispatch({
          type: "SET_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE",
          projectsResponse: getProjectsResponse,
        })
      )
      .catch(error => {
        UniversalDispatcher.dispatch({
          type: "ERROR",
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

  getSearchConfig(): EntitySearchConfig {
    return this.getState().searchSettings.searchConfig;
  }

  getDefaultSortField(): string {
    const searchConfig: EntitySearchConfig = this.getState().searchSettings
      .searchConfig;
    return searchConfig?.defaultSort;
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

  getEntities() {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.projects;
  }

  getEntityPages(): number {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.numPages;
  }

  getCurrentPage(): number {
    return this.getState().page;
  }

  getFavoritesOnly(): boolean {
    return this.getState().favoritesOnly;
  }

  getNumberOfEntities(): number {
    const state: State = this.getState();
    return state.projectsData && state.projectsData.numProjects;
  }

  isLoading(): boolean {
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

export default new EntitySearchStore();
