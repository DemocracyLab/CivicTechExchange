// @flow

'use strict';

import type {ProjectSearchActionType} from './ProjectSearchStore';

import {Dispatcher} from 'flux';

const ProjectSearchDispatcher: Dispatcher<ProjectSearchActionType> = new Dispatcher();

export default ProjectSearchDispatcher;
