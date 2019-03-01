// @flow

'use strict';

import type {MyProjectsActionType} from './MyProjectsStore.js';

import {Dispatcher} from 'flux';

const MyProjectsDispatcher: Dispatcher<MyProjectsActionType> = new Dispatcher();

export default MyProjectsDispatcher;
