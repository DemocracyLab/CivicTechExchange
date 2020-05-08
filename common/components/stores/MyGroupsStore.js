// // @flow

import {ReduceStore} from 'flux/utils';
import {Record} from 'immutable'
// import type {TagDefinition, VolunteerUserData} from '../utils/ProjectAPIUtils.js';
import UniversalDispatcher from './UniversalDispatcher.js';

export type MyGroupData = {|
  +group_id: number,
  +group_name: string,
  +group_creator: number,
//   +application_id: ?number,
//   +user: ?VolunteerUserData,
//   +application_text: ?string,
//   +roleTag: ?TagDefinition,
  +isApproved: ?boolean,
  +isCreated: ?boolean,
|};

export type MyGroupsAPIResponse = {|
  owned_groups: $ReadOnlyArray<MyGroupData>,
//   volunteering_groups: $ReadOnlyArray<MyGroupData>
|};

export type MyGroupsActionType = {
  type: 'INIT'
} | {
  type: 'SET_MY_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE',
  myProjectsResponse: MyGroupsAPIResponse
};

const DEFAULT_STATE = {
  myGroups: null,
  isLoading: false
};

class State extends Record(DEFAULT_STATE) {
  myGroups: ?MyGroupsAPIResponse;
  isLoading: boolean;
}

// class MyGroupsStore extends ReduceStore<State> {
class MyGroupsStore {
  // constructor(): void {
  //   super(UniversalDispatcher);
  // }
  //
  // getInitialState(): State {
  //   return new State();
  // }

  reduce(state: State, action: MyProjectsActionType): State {
    // TODO: See if we need to ensure no duplicate action names between stores that use UniversalDispatcher
    switch (action.type) {
      case 'INIT':
        if(!state.isLoading || !state.myGroups) {
          return this._loadGroups(state);
        } else {
          return state;
        }
      case 'SET_MY_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE':
        state = state.set('isLoading', false);
        return state.set('myGroups', action.myGroupsResponse);
      default:
        return state;
    }
  }
  
  _loadGroups(state: State): State {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener(
      'load',
      () => {
        const myGroupsApiResponse: MyGroupsAPIResponse = JSON.parse(xhr.response);
        // UniversalDispatcher.dispatch({
        //   type: 'SET_MY_GROUPS_DO_NOT_CALL_OUTSIDE_OF_STORE',
        //   myGroupsResponse: myGroupsApiResponse
        // });
      }
    );
    // xhr.open('GET', '/api/my_groups');
    // xhr.send();
    // return state.set('isLoading', true);
  }

  getMyGroups(): ?MyGroupsAPIResponse {
    const state: State = this.getState();
    return state.myGroups;
  }
}

export default new MyGroupsStore();