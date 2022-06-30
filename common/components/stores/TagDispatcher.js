// @flow

"use strict";

import type { TagActionType } from "./TagStore";

import { Dispatcher } from "flux";

// TODO: Delete
const TagDispatcher: Dispatcher<TagActionType> = new Dispatcher();

export default TagDispatcher;
