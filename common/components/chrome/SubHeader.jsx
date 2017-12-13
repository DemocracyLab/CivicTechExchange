// @flow

import type {FluxReduceStore} from 'flux/utils';
import type {SectionType} from '../enums/Section.js';

import {Container} from 'flux/utils';
import cx from '../utils/cx';
import NavigationDispatcher from '../stores/NavigationDispatcher.js'
import NavigationStore from '../stores/NavigationStore.js'
import SectionLinkConfigs from '../configs/SectionLinkConfigs.js';
import SectionLink from './SectionLink.jsx';
import React from 'react';
import Section from '../enums/Section.js'

type State = {|
  +activeSection: SectionType,
|};

class SubHeader extends React.Component<{||}, State> {

  _cx: cx;

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore];
  }

  static calculateState(prevState: State): State {
    return {
      activeSection: NavigationStore.getSection(),
    };
  }

  constructor(): void {
    super();
    this._cx = new cx('SubHeader-');
  }

  render(): React$Node {
    return (
      <div className={this._cx.get('root')}>
        {this._renderSectionLinks()}
        <span className={this._cx.get('rightContent')}>
          <button
            className={this._cx.get('createProject')}
            onClick={this._goToCreateProject}
            >
            Create A Project
          </button>
        </span>
      </div>
    );
  }

  _renderSectionLinks(): React$Node {
    return SectionLinkConfigs
      .map(config =>
        <SectionLink
          activeSection={this.state.activeSection}
          key={config.title}
          section={config.section}
          title={config.title}
        />
      );
  }

  _goToCreateProject(): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: Section.CreateProject,
    });
    window.FB.AppEvents.logEvent('CreateProjectNavBarClick');
  }
}

export default Container.create(SubHeader);
