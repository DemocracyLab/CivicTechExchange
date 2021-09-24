// @flow

"use strict";

import { Dispatcher } from "flux";
import type { NavigationActionType } from "./NavigationStore.js";
import type { OffsetActionType } from "./PageOffsetStore.js";
import type { LinkListActionType } from "./LinkListStore.js";
import type { FormFieldsActionType } from "./FormFieldsStore.js";
import type { FavoritesActionType } from "./FavoritesStore.js";

type UniversalActionType =
  | NavigationActionType
  | OffsetActionType
  | LinkListActionType
  | FormFieldsActionType
  | FavoritesActionType;

const UniversalDispatcher: Dispatcher<UniversalActionType> = new Dispatcher();

export default UniversalDispatcher;
