// @flow

"use strict";

import { Dispatcher } from "flux";
import type { NavigationActionType } from "./NavigationStore.js";
import type { OffsetActionType } from "./PageOffsetStore.js";
import type { FormFieldsActionType } from "./FormFieldsStore.js";
import type { FavoritesActionType } from "./FavoritesStore.js";
import type { EntitySearchActionType } from "./EntitySearchStore.js";

type UniversalActionType =
  | NavigationActionType
  | OffsetActionType
  | FormFieldsActionType
  | FavoritesActionType
  | EntitySearchActionType;

const UniversalDispatcher: Dispatcher<UniversalActionType> = new Dispatcher();

export default UniversalDispatcher;
