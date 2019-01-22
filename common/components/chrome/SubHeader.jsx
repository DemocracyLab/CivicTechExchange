// @flow

import type { FluxReduceStore } from 'flux/utils';
import type { SectionType } from '../enums/Section.js';

import { Container } from 'flux/utils';
import cdn from "../utils/cdn.js";
import cx from '../utils/cx';
import CurrentUser from '../../components/utils/CurrentUser.js';
import FooterLinks from "../utils/FooterLinks.js";
import NavigationDispatcher from '../stores/NavigationDispatcher.js'
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

type State = {|
  +activeSection: SectionType,
  user: ?UserAPIData,
    dropdown: boolean,
      slider: boolean,
|};

class SubHeader extends React.Component<{||}, State > {

  _cx: cx;

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore];
  }

  static calculateState(prevState: State): State {
    return {
      activeSection: NavigationStore.getSection(),
    };
  }
  
  navigateToSection(e, section: string): void {
    this._closeDropdown(e);
    NavigationDispatcher.dispatch({
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
    }
    this._toggleDropdown = this._toggleDropdown.bind(this);
    this._closeDropdown = this._closeDropdown.bind(this);
    this._renderHamburgerSlider = this._renderHamburgerSlider.bind(this);
    this._toggleSlider = this._toggleSlider.bind(this)
  }

  componentDidMount() {
    UserAPIUtils.fetchUserDetails(window.DLAB_GLOBAL_CONTEXT.userID, this.loadUserDetails.bind(this));
  }

  loadUserDetails(user: UserAPIData) {
    this.setState({
      user: user
    });
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
          {this._renderHamburgerSlider()}
        <div className={this._cx.get('rightContent')}>
          {this._renderSectionLinks()}
          {this._renderHeaderLinks()}
          {
            CurrentUser.isLoggedIn() ?
              this._renderAccountInfo() :
              this._renderLogInButton()
          }
          <a href='#' className='SubHeader-donate-btn-container'>
            <button className='SubHeader-donate-btn'>
              Donate
            </button>
          </a>
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
                    <MenuItem onClick={(e) => this.navigateToSection(e, 'MyProjects')}>My Projects</MenuItem>
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
    if (this.anchorEl.contains(event.target)) {
      return;
    };
    this.setState({ dropdown: false });
  };

  _renderHamburgerSlider(): React$Node {
    return (
      <React.Fragment>
        <div className="SubHeader-hamburger" onClick={() => this._toggleSlider(true)}>
          <IconButton >
            <MenuIcon />
          </IconButton>
        </div>
        <Drawer open={this.state.slider} onClose={() => this._toggleSlider(false)} styles={{overflow: 'hidden'}}>
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
                <a href="" onClick={() => this._navigateToSection('MyProfile')}>
                  <div className={'SubHeader-drawerDiv'} >
                    My Profile
                  </div>
                </a>
                <Divider />
                <a href="" onClick={() => this._navigateToSection('MyProjects')}>
                  <div className={'SubHeader-drawerDiv'} >
                    My Projects
                  </div>
                </a>
                <Divider />
              </div>
              
            }
              <a href="" onClick={() => this._navigateToSection('FindProjects')}>
                <div className={'SubHeader-drawerDiv'} >
                  Find Projects
                </div>
              </a>
              <Divider />
              <a href="http://connect.democracylab.org" target="_blank" rel="noopener noreferrer">
                <div className={'SubHeader-drawerDiv'} onClick={() => this._navigateToSection('FindProjects')}>
                  About
                </div>
              </a>
              <Divider />
              <a href="mailto:hello@democracylab.org" target="_blank" rel="noopener noreferrer">
                <div className={'SubHeader-drawerDiv'} onClick={() => this._navigateToSection('FindProjects')}>
                  Contact Us
                </div>
              </a>
              <Divider />
              {
                !CurrentUser.isLoggedIn() &&
                <React.Fragment>
                  <div className={'SubHeader-drawerDiv'} onClick={() => this._navigateToSection('LogIn')}>
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

  _toggleSlider(open: boolean): void {
    this.setState({ slider: open })
  }

  _renderHeaderLinks(): React$Node {
    return FooterLinks.list().map((link, i) =>
      <div className="SectionLink-root" key={i}>
        <a className="SubHeader-anchor" href={link.url} target="_blank" rel="noopener noreferrer">
          <h3>{link.name}</h3>
        </a>
      </div>
    );
  }

  _renderIcon(): React$Node {
    return (
      this.state.user && this.state.user.user_thumbnail ?
        <img className="SubHeader-userImg" src={this.state.user.user_thumbnail} /> :
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
        />
      );
  }

  _renderHeaderMenuLinks(): $ReadOnlyArray<React$Node> {
    return FooterLinks.list().map((link, i) => {
      return <MenuItem href={link.url} key={i}>{link.name}</MenuItem>
    });
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
