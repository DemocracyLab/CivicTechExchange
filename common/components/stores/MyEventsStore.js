// // @flow

import { ReduceStore } from "flux/utils";
import { Record } from "immutable";
import UniversalDispatcher from "./UniversalDispatcher.js";
import CurrentUser from "../utils/CurrentUser.js";
import type { EventTileAPIData } from "../utils/EventAPIUtils.js";

export type MyEventData = {|
  +event_creator: string,
  +is_searchable: ?boolean,
  +is_created: ?boolean,
|} & EventTileAPIData;

export type MyEventsAPIResponse = {|
  owned_events: $ReadOnlyArray<MyEventData>,
  private_events: ?$ReadOnlyArray<MyEventData>,
|};

export type MyEventsActionType =
  | {
      type: "INIT",
    }
  | {
      type: "SET_MY_EVENTS_DO_NOT_CALL_OUTSIDE_OF_STORE",
      myEventsResponse: MyEventsAPIResponse,
    };

const DEFAULT_STATE = {
  myEvents: null,
  isLoading: false,
};

class State extends Record(DEFAULT_STATE) {
  myEvents: ?MyEventsAPIResponse;
  isLoading: boolean;
}

class MyEventsStore extends ReduceStore<State> {
  constructor(): void {
    super(UniversalDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: MyEventsActionType): State {
    switch (action.type) {
      case "INIT":
        if (CurrentUser.isLoggedIn() && (!state.isLoading || !state.myEvents)) {
          return this._loadEvents(state);
        } else {
          return state;
        }
      case "SET_MY_EVENTS_DO_NOT_CALL_OUTSIDE_OF_STORE":
        state = state.set("isLoading", false);
        return state.set("myEvents", action.myEventsResponse);
      default:
        return state;
    }
  }

  _loadEvents(state: State): State {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      const myEventsAPIResponse: MyEventsAPIResponse = JSON.parse(xhr.response);
      UniversalDispatcher.dispatch({
        type: "SET_MY_EVENTS_DO_NOT_CALL_OUTSIDE_OF_STORE",
        myEventsResponse: myEventsAPIResponse,
      });
    });
    xhr.open("GET", "/api/my_events");
    xhr.send();
    return state.set("isLoading", true);
  }

  getMyEvents(): ?MyEventsAPIResponse {
    const state: State = this.getState();
    return state.myEvents;
  }
}

export default new MyEventsStore();
