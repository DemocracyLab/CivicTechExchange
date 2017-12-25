// @flow

'use strict';

import type {NavigationActionType} from './NavigationStore';

import {Dispatcher} from 'flux';

const NavigationDispatcher: Dispatcher<NavigationActionType> = new Dispatcher();

export default NavigationDispatcher;
