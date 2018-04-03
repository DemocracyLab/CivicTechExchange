// @flow

import type {SectionType} from '../enums/Section.js';

import {ReduceStore} from 'flux/utils';
import NavigationDispatcher from './NavigationDispatcher.js';
import {List, Record} from 'immutable'
import Section from '../enums/Section.js';

export type NavigationActionType = {
  type: 'SET_SECTION',
  section: SectionType,
  url: string
};

const DEFAULT_STATE = {
  section: Section.FindProjects,
};

class State extends Record(DEFAULT_STATE) {
  section: SectionType;
  url: string;
}

class NavigationStore extends ReduceStore<State> {
  constructor(): void {
    super(NavigationDispatcher);
  }

  getInitialState(): State {
    return new State();
  }

  reduce(state: State, action: NavigationActionType): State {
    switch (action.type) {
      case 'SET_SECTION':
        history.pushState({}, '', action.url);
        return state.set('section', action.section);
      default:
        (action: empty);
        return state;
    }
  }

  getSection(): SectionType {
    return this.getState().section;
  }
}

export default new NavigationStore();
