// @flow

'use strict';

import type {MyProjectsActionType} from './MyProjectsStore.js';
import type {NavigationActionType} from './NavigationStore.js';

import {Dispatcher} from 'flux';

type UniversalActionType = MyProjectsActionType | NavigationActionType;

const UniversalDispatcher: Dispatcher<UniversalActionType> = new Dispatcher();

export default UniversalDispatcher;
