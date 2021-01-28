// @flow

import { Dispatcher } from "flux";
import type { EventSearchActionType } from "./EventSearchStore.js";

const EventSearchDispatcher: Dispatcher<EventSearchActionType> = new Dispatcher();

export default EventSearchDispatcher;
