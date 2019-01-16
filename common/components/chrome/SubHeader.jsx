// @flow

import type {FluxReduceStore} from 'flux/utils';
import type {SectionType} from '../enums/Section.js';

import {Container} from 'flux/utils';
import cdn from "../utils/cdn.js";
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
  
  navigateToSection(section: string): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: section,
      url: url.section(section)
    });
  }

  constructor(): void {
    super();
    this._cx = new cx('SubHeader-');
  }

  render(): React$Node {
    return (
      <div className={this._cx.get('root')}>
       <div className="SubHeader-logo-container" onClick={this._onHomeButtonClick}>
          <img
            className="SubHeader-logo"
            src={cdn.image("dl_logo.png")}
          />
        </div>
        <div className={this._cx.get('leftContent')}>
          {this._renderSectionLinks()}
        </div>
        <div className={this._cx.get('rightContent')}>
          {/* {this._renderCreateProjectButton()} */}
          {
            CurrentUser.isLoggedIn() ?
            this._renderLogOutButton() :
            this._renderLogInButton()
          }
        </div>
      </div>
    );
  }

  _onHomeButtonClick(): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: Section.FindProjects,
      url: url.section(Section.FindProjects)
    });
  }

  _renderLogInButton(): void {
    return (
      <button onClick={this._onLogInClick} className='SubHeader-log-btns'>
        Log In
      </button>
    );
  }

  _renderLogOutButton(): void {
    return (
    <a href='/logout/'>
      <button className='SubHeader-log-btns'>
        Log Out
      </button>
    </a>
    )
  }

  _renderSectionLinks(): React$Node {
    const SectionsToShow = CurrentUser.isLoggedIn() ?
    SectionLinkConfigs : SectionLinkConfigs
      .filter(config => !config.showOnlyWhenLoggedIn);
      return SectionsToShow
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
    const section: string = CurrentUser.isLoggedIn() ? Section.CreateProject : Section.LogIn;
    return (
      <span className={this._cx.get('createProject')} onClick={this.navigateToSection.bind(this, section)}>
        Create a Project
      </span>
    )
  }

  _onLogInClick(): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: Section.LogIn,
      url: url.section(Section.LogIn)
    });
  }

  _onLogOutClick(): void {
    history.replaceState({}, '', '/logout')
  }

}

export default Container.create(SubHeader);
