// @flow

'use strict';

import {Dispatcher} from 'flux';
import type {GroupSearchActionType} from "./GroupSearchStore.js";

const GroupSearchDispatcher: Dispatcher<GroupSearchActionType> = new Dispatcher();

export default GroupSearchDispatcher;
