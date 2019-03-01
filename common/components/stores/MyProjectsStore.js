// @flow

import {ReduceStore} from 'flux/utils';
import {Record} from 'immutable'
import type {TagDefinition, VolunteerUserData} from '../utils/ProjectAPIUtils.js';
import MyProjectsDispatcher from "./MyProjectsDispatcher.js";

export type MyProjectData = {|
  +project_id: number,
  +project_name: string,
  +project_creator: number,
  +application_id: ?number,
  +user: ?VolunteerUserData,
  +application_text: ?string,
  +roleTag: ?TagDefinition,
  +isApproved: ?boolean,
  +isCoOwner: ?boolean
|};

export type MyProjectsAPIResponse = {|
  owned_projects: $ReadOnlyArray<MyProjectData>,
  volunteering_projects: $ReadOnlyArray<MyProjectData>
|};

export type MyProjectsActionType = {
  type: 'INIT'
} | {
  type: 'SET_MY_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
  myProjectsResponse: MyProjectsAPIResponse
};

const DEFAULT_STATE = {
  myProjects: null,
  isLoading: false
};

class State extends Record(DEFAULT_STATE) {
  myProjects: ?MyProjectsAPIResponse;
  isLoading: boolean;
}

class MyProjectsStore extends ReduceStore<State> {
  constructor(): void {
    super(MyProjectsDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: MyProjectsActionType): State {
    switch (action.type) {
      case 'INIT':
        if(!state.isLoading || !state.myProjects) {
          return this._loadProjects(state);
        } else {
          return state;
        }
      case 'SET_MY_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        state = state.set('isLoading', false);
        return state.set('myProjects', action.myProjectsResponse);
      default:
        return state;
    }
  }
  
  _loadProjects(state: State): State {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener(
      'load',
      () => {
        const myProjectsApiResponse: MyProjectsAPIResponse = JSON.parse(xhr.response);
        MyProjectsDispatcher.dispatch({
          type: 'SET_MY_PROJECTS_DO_NOT_CALL_OUTSIDE_OF_STORE',
          myProjectsResponse: myProjectsApiResponse
        });
      }
    );
    xhr.open('GET', '/api/my_projects');
    xhr.send();
    return state.set('isLoading', true);
  }

  getMyProjects(): ?MyProjectsAPIResponse {
    const state: State = this.getState();
    return state.myProjects;
  }
}

export default new MyProjectsStore();