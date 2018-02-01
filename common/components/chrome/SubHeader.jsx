// @flow

import type {FluxReduceStore} from 'flux/utils';
import type {SectionType} from '../enums/Section.js';

import {Container} from 'flux/utils';
import cx from '../utils/cx';
import CurrentUser from '../../components/utils/CurrentUser.js';
import NavigationDispatcher from '../stores/NavigationDispatcher.js'
import NavigationStore from '../stores/NavigationStore.js'
import SectionLinkConfigs from '../configs/SectionLinkConfigs.js';
import SectionLink from './SectionLink.jsx';
import React from 'react';
import Section from '../enums/Section.js'
import url from '../utils/url.js'

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
  
  navigateToCreateProject(): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: Section.CreateProject,
      url: url.section(Section.CreateProject)
    });
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
          {this._renderCreateProjectButton()}
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
  
  _renderCreateProjectButton(): ?React$Node {
    if(CurrentUser.isLoggedIn()) {
      return (
        <span className={this._cx.get('createProject')} onClick={this.navigateToCreateProject.bind(this)}>
        Create A Project
      </span>
      );
    }
  }

}

export default Container.create(SubHeader);
