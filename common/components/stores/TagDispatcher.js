// @flow

'use strict';

import type {TagActionType} from './TagStore';

import {Dispatcher} from 'flux';

const TagDispatcher: Dispatcher<TagActionType> = new Dispatcher();

export default TagDispatcher;
