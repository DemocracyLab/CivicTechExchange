// @flow

import { ReduceStore } from "flux/utils";
import { Record } from "immutable";
import UniversalDispatcher from "./UniversalDispatcher.js";
import type { Dictionary } from "../types/Generics.jsx";
import ProjectAPIUtils, { ProjectData } from "../utils/ProjectAPIUtils.js";
import CurrentUser, { UserContext } from "../utils/CurrentUser.js";

export type FavoritesActionType = {
  type: "SET_FAVORITE" | "SET_FAVORITE_SUCCESS",
  projectId: string,
  favorited: boolean,
};

const DEFAULT_STATE = {
  projectFavorites: {},
};

class State extends Record(DEFAULT_STATE) {
  projectFavorites: Dictionary<ProjectData>;
}

// Store for broadcasting the header height to any components that need to factor it in
class FavoritesStore extends ReduceStore<State> {
  constructor(): void {
    super(UniversalDispatcher);
  }

  getInitialState(): State {
    const userContext: UserContext = CurrentUser.userContext();
    return new State({
      projectFavorites: (userContext && userContext.favorites) || {},
    });
  }

  reduce(state: State, action: FavoritesActionType): State {
    switch (action.type) {
      case "SET_FAVORITE":
        return this._applyFavoriteAction(state, action);
      case "SET_FAVORITE_SUCCESS":
        return this._favoriteActionSuccess(state, action);
      default:
        (action: empty);
        return state;
    }
  }

  _applyFavoriteAction(state: State, action: FavoritesActionType): State {
    const toggleOperation: string = action.favorited
      ? "favorite"
      : "unfavorite";
    ProjectAPIUtils.post(
      `/api/${toggleOperation}/project/${action.projectId}/`,
      {},
      response => {
        UniversalDispatcher.dispatch({
          ...action,
          type: "SET_FAVORITE_SUCCESS",
        });
      }
    );
    return state;
  }

  _favoriteActionSuccess(state: State, action: FavoritesActionType): State {
    return new State({
      projectFavorites: {
        ...state.projectFavorites,
        [action.projectId]: action.favorited,
      },
    });
  }

  noFavorites(): boolean {
    const projectFavorites: Dictionary<ProjectData> = this.getState()
      .projectFavorites;
    return (
      _.isEmpty(projectFavorites) ||
      _.every(_.values(projectFavorites), (fav: boolean) => !fav)
    );
  }

  isFavoriteProject(projectId: string): boolean {
    return !!this.getState().projectFavorites[projectId];
  }
}

export default new FavoritesStore();
