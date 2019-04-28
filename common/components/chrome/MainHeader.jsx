// @flow

import type { FluxReduceStore } from 'flux/utils';
import type { SectionType } from '../enums/Section.js';

import { Container } from 'flux/utils';
import cdn from "../utils/cdn.js";
import cx from '../utils/cx';
import CurrentUser from '../../components/utils/CurrentUser.js';
import FooterLinks from "../utils/FooterLinks.js";
import NavigationStore from '../stores/NavigationStore.js'
import SectionLinkConfigs from '../configs/SectionLinkConfigs.js';
import SectionLink from './SectionLink.jsx';
import React from 'react';
import Section from '../enums/Section.js'
import url from '../utils/url.js'
import UserAPIUtils from "../utils/UserAPIUtils";
import Person from '@material-ui/icons/Person';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import {FooterLink} from "../utils/FooterLinks.js";
import AlertHeader from "./AlertHeader.jsx";
import MyProjectsStore, {MyProjectsAPIResponse} from "../stores/MyProjectsStore.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import _ from 'lodash'

type State = {|
  +activeSection: SectionType,
  user: ?UserAPIData,
  dropdown: boolean,
  slider: boolean,
  createProjectUrl: string,
  showMyProjects: boolean
|};

class MainHeader extends React.Component<{||}, State > {

  _cx: cx;

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore, MyProjectsStore];
  }

  static calculateState(prevState: State): State {
    const myProjects: MyProjectsAPIResponse = MyProjectsStore.getMyProjects();
    return {
      activeSection: NavigationStore.getSection(),
      showMyProjects: myProjects && (!_.isEmpty(myProjects.volunteering_projects) || !_.isEmpty(myProjects.owned_projects))
    };
  }

  navigateToSection(e, section: string): void {
    this._closeDropdown(e);
    UniversalDispatcher.dispatch({
      type: 'SET_SECTION',
      section: section,
      url: url.section(section)
    });
  }

  constructor(): void {
    super();
    this._cx = new cx('SubHeader-');
    this.state = {
      user: null,
      dropdown: false,
      slider: false,
      showMyProjects: false,
      createProjectUrl: url.sectionOrLogIn(Section.CreateProject)
    };
    this._toggleDropdown = this._toggleDropdown.bind(this);
    this._closeDropdown = this._closeDropdown.bind(this);
    this._renderHamburgerSlider = this._renderHamburgerSlider.bind(this);
    this._toggleSlider = this._toggleSlider.bind(this);
    this._handleHeightChange = this._handleHeightChange.bind(this);
    this.mainHeaderRef = React.createRef();
  }

  componentDidMount() {
    UniversalDispatcher.dispatch({type: 'INIT'});
    this._handleHeightChange(this.mainHeaderRef.current.clientHeight);
    CurrentUser.isLoggedIn() && UserAPIUtils.fetchUserDetails(CurrentUser.userID(), this.loadUserDetails.bind(this));
  }

  loadUserDetails(user: UserAPIData) {
    this.setState({
      user: user
    });
  }

  render(): React$Node {
    return (
      <div ref={this.mainHeaderRef} className='MainHeader'>
        <AlertHeader onAlertClose={this._handleAlertClosing.bind(this)}/>
        <div className={this._cx.get('root')}>
          <a href={url.section(Section.FindProjects, {showSplash: 1})}>
            <div className="SubHeader-logo-container">
              <img
                className="SubHeader-logo"
                src={cdn.image("dl_logo.png")}
              />
            </div>
          </a>
          {this._renderHamburgerSlider()}
          <div className={this._cx.get('rightContent')}>
            {this._renderSectionLinks()}
            {this._renderHeaderLinks()}
            {
              CurrentUser.isLoggedIn() ?
                this._renderAccountInfo() :
                this._renderLogInButton()
            }
            {this._renderCreateProjectButton()}
            {this._renderHeaderButtons()}
          </div>
        </div>
      </div>
    );
  }

  _handleHeightChange(height) {
    this.props.onMainHeaderHeightChange(height);
  }

  _handleAlertClosing() {
    let header = this.mainHeaderRef.current;
    this._handleHeightChange(header.clientHeight - header.firstChild.clientHeight);
  }

  _renderLogInButton(): void {
    return (
      <button onClick={this._onLogInClick} className='SubHeader-log-btns'>
        Log In
      </button>
    );
  }

  _renderAccountInfo(): void {
    return (
      <div className="SubHeader-userImg-container">
        <button
          className="SubHeader-user-btn"
          ref={node => { this.anchorEl = node }}
          onClick={this._toggleDropdown}
        >
          {this._renderIcon()}
        </button>
        <Popper open={this.state.dropdown} anchorEl={this.anchorEl} transition>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: 'top' }}
            >
              <Paper className="SubHeader-dropdown-menu">
                <ClickAwayListener onClickAway={this._closeDropdown}>
                  <MenuList>
                    <p className="SubHeader-dropdown-name">{`${this.state.user.first_name} ${this.state.user.last_name}`}</p>
                    <MenuItem onClick={(e) => this.navigateToSection(e, 'EditProfile')}>My Profile</MenuItem>
                    {this.state.showMyProjects && <MenuItem onClick={(e) => this.navigateToSection(e, 'MyProjects')}>My Projects</MenuItem>}
                  </MenuList>
                  <Divider />
                  <a href="/logout" onClick={this._closeDropdown}>
                    <MenuItem>
                      Sign Out
                    </MenuItem>
                  </a>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    )
  }

  _toggleDropdown(): void {
    this.setState({ dropdown: !this.state.dropdown });
  };

  _closeDropdown(event): void {
    if (this.anchorEl && this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ dropdown: false });
  };

  _renderHamburgerSlider(): React$Node {
    // TODO: Refactor into separate component
    return (
      <React.Fragment>
        <div className="SubHeader-hamburger" onClick={() => this._toggleSlider(true)}>
          <IconButton >
            <MenuIcon />
          </IconButton>
        </div>
        <Drawer anchor="right" open={this.state.slider} onClose={() => this._toggleSlider(false)} styles={{overflow: 'hidden'}}>
          <div
            tabIndex={0}
            role="button"
            onClick={() => this._toggleSlider(false)}
            onKeyDown={() => this._toggleSlider(false)}
          >
            <div className="SubHeader-navDrawer">
              {
                CurrentUser.isLoggedIn() &&
                <div>
                  <div className='SubHeader-slider-icon'>
                    {this._renderIcon()}
                  </div>
                  <p className='SubHeader-slider-name'>{CurrentUser.firstName() + ' ' + CurrentUser.lastName()} </p>
                  <a href="" onClick={(e) => this.navigateToSection(e, 'EditProfile')}>
                    <div className={'SubHeader-drawerDiv'} >
                      My Profile
                    </div>
                  </a>
                  <Divider />

                  {
                    this.state.showMyProjects && [
                    <a href="" onClick={(e) => this.navigateToSection(e, 'MyProjects')}>
                      <div className={'SubHeader-drawerDiv'} >
                        My Projects
                      </div>
                    </a>,
                    <Divider />
                    ]
                  }
                </div>

              }
              <a href={url.section(Section.FindProjects, {hideSplash: 1})}>
                <div className={'SubHeader-drawerDiv'} >
                  Find Projects
                </div>
              </a>
              <Divider />

              <a href={this.state.createProjectUrl}>
                <div className={'SubHeader-drawerDiv'} >
                  Create Project
                </div>
              </a>
              <Divider />

              {this._renderHamburgerFooterLinks()}

              <Divider />
              {
                !CurrentUser.isLoggedIn() &&
                <React.Fragment>
                  <div className={'SubHeader-drawerDiv'} onClick={this._onLogInClick}>
                    <a href="" > Log In </a>
                  </div>
                  <Divider />
                </React.Fragment>
              }
              {
                CurrentUser.isLoggedIn() &&
                <a href="/logout/">
                  <div className={'SubHeader-drawerDiv'}>
                    Logout
                  </div>
                </a>
              }
            </div>
          </div>
        </Drawer>
      </React.Fragment>

    )
  }

  _renderHamburgerFooterLinks(): $ReadOnlyArray<React$Node> {
    //TODO: refactor FooterLinks to define link behavior on a per-link basis
    return FooterLinks.list().map((link) => {
      return (
        <React.Fragment key={link.url}>
          <a key={link.url} href={link.url} rel="noopener noreferrer" onClick={FooterLinks.logClick.bind(this, link)}>
            <div className={'SubHeader-drawerDiv'}>
              {link.name}
            </div>
          </a>
          <Divider />
        </React.Fragment>
      );
    });
  }

  _toggleSlider(open: boolean): void {
    this.setState({ slider: open })
  }

  _renderHeaderLinks(): React$Node {
    //TODO: Same issue as FooterLinks, refactor to pass link behavior as part of env variable
    const headerLinks: $ReadOnlyArray<FooterLink> = FooterLinks.list().filter((link) => !link.isButton);
    return (
      <React.Fragment>
        {
          headerLinks.map((link) => {
            return (
              <div key={link.url} className="SectionLink-root">
                <a className="SubHeader-anchor" href={link.url} rel="noopener noreferrer" onClick={FooterLinks.logClick.bind(this, link)}>
                  <h3>{link.name}</h3>
                </a>
              </div>
            );
          })
        }
      </React.Fragment>
    );
  }

  _renderHeaderButtons(): React$Node {
    const headerButtonLinks: $ReadOnlyArray<React$Node> = FooterLinks.list().filter((link) => link.isButton);
    return (
      headerButtonLinks.map((link) => {
        return (
          <a key={link.url}
             href={link.url}
             className="SubHeader-donate-btn-container"
             onClick={FooterLinks.logClick.bind(this, link)}
             target="_blank" rel="noopener noreferrer"
          >
            <button className="SubHeader-donate-btn">
              {link.name}
            </button>
          </a>
        );
      })
    )
  }

  _renderCreateProjectButton(): React$Node{
    return (
      <a key={this.state.createProjectUrl}
        href={this.state.createProjectUrl}
        className="SubHeader-donate-btn-container"
      >
        <button className="SubHeader-log-btns">
          Create Project
        </button>
      </a>
    );
  }

  _renderIcon(): React$Node {
    return (
      this.state.user && !_.isEmpty(this.state.user.user_thumbnail) ?
        <img className="SubHeader-userImg" src={this.state.user.user_thumbnail.publicUrl} /> :
        <Person className="SubHeader-userIcon" />
    );
  }

  _renderSectionLinks(): React$Node {
    const SectionsToShow = SectionLinkConfigs
      .filter(config => !config.showOnlyWhenLoggedIn);
    return SectionsToShow
      .map(config =>
        <SectionLink
          activeSection={this.state.activeSection}
          key={config.title}
          section={config.section}
          title={config.title}
          target="_blank" rel="noopener noreferrer"
        />
      );
  }

  _onLogInClick(): void {
    UniversalDispatcher.dispatch({
      type: 'SET_SECTION',
      section: Section.LogIn,
      url: url.section(Section.LogIn, url.getPreviousPageArg())
    });
  }
}

export default Container.create(MainHeader);
