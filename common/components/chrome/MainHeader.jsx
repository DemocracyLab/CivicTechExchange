// @flow

import type { FluxReduceStore } from 'flux/utils';
import type { SectionType } from '../enums/Section.js';

import { Container } from 'flux/utils';
import cdn from "../utils/cdn.js";
import cx from '../utils/cx';
import CurrentUser from '../utils/CurrentUser.js';
import NavigationLinks, {NavigationLink} from "../utils/NavigationLinks.js";
import NavigationStore from '../stores/NavigationStore.js'
import SectionLink from './SectionLink.jsx';
import React from 'react';
import Section from '../enums/Section.js'
import url from '../utils/url.js'
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
import AlertHeader from "./AlertHeader.jsx";
import MyProjectsStore, {MyProjectsAPIResponse} from "../stores/MyProjectsStore.js";
// import MyGroupsStore, {MyGroupsAPIResponse} from "../stores/MyGroupsStore.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import _ from 'lodash'

type State = {|
  +activeSection: SectionType,
  dropdown: boolean,
  slider: boolean,
  createProjectUrl: string,
  showMyProjects: boolean,
  showMyGroups: boolean,
  showHeader: boolean
|};

class MainHeader extends React.Component<{||}, State > {

  _cx: cx;

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore, MyProjectsStore];
  }

  static calculateState(prevState: State): State {
    const myProjects: MyProjectsAPIResponse = MyProjectsStore.getMyProjects();
    // const myGroups: MyGroupsAPIResponse = MyGroupsStore.getMyGroups();
    return {
      showHeader: !url.argument("embedded"),
      activeSection: NavigationStore.getSection(),
      showMyProjects: myProjects && (!_.isEmpty(myProjects.volunteering_projects) || !_.isEmpty(myProjects.owned_projects))
      // showMyGroups: myGroups && (!_.isEmpty(myGroups.owned_groups))
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
    this._handleHeightChange(this.getHeaderHeight());
  }

  render(): ?React$Node {
    return this.state.showHeader && (
      <div ref={this.mainHeaderRef} className='MainHeader'>
        <AlertHeader
          onAlertClose={this._handleAlertClosing.bind(this)}
          onUpdate={this._onAlertHeaderUpdate.bind(this)}
        />
        <div className={this._cx.get('root')}>
          <a href={url.section(Section.Home)}>
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
            {window.BLOG_URL && <div className="SectionLink-root"><h3><a href={window.BLOG_URL}>Blog</a></h3></div>}
            {window.EVENT_URL && <div className="SectionLink-root"><h3><a href={_.unescape(window.EVENT_URL)}>Event</a></h3></div>}
            {this._renderHeaderLinks()}
            {this._renderHeaderButtons()}
            {
              <React.Fragment>
                <div className="SubHeader-divider-container">
                  <div className="vertical-divider"></div>
                </div>
              </React.Fragment>
            }
            {
              CurrentUser.isLoggedIn() ?
                this._renderAccountInfo() :
                this._renderLogInLink()
            }
          </div>
        </div>
      </div>
    );
  }

  getHeaderHeight(): number {
    return this.mainHeaderRef.current ? this.mainHeaderRef.current.clientHeight : 0;
  }

  _onAlertHeaderUpdate() {
    this._handleHeightChange(this.getHeaderHeight());
  }

  _handleHeightChange(height) {
    this.props.onMainHeaderHeightChange(height);
  }

  _handleAlertClosing() {
    let header = this.mainHeaderRef.current;
    this._handleHeightChange(header.clientHeight - header.firstChild.clientHeight);
  }

  _renderLogInLink(): void {
    return (
      <SectionLink
          activeSection={this.state.activeSection}
          key="LogIn"
          section={Section.LogIn}
          title="Log In"
        />
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
                    <p className="SubHeader-dropdown-name">{`${CurrentUser.firstName()} ${CurrentUser.lastName()}`}</p>
                    <MenuItem onClick={(e) => this.navigateToSection(e, 'EditProfile')}>My Profile</MenuItem>
                    {this.state.showMyProjects && <MenuItem onClick={(e) => this.navigateToSection(e, 'MyProjects')}>My Projects</MenuItem>}
                    {this.state.showMyGroups && <MenuItem onClick={(e) => this.navigateToSection(e, 'MyGroups')}>My Groups</MenuItem>}
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

                  {
                    this.state.showMyGroups && [
                    <a href="" onClick={(e) => this.navigateToSection(e, 'MyGroups')}>
                      <div className={'SubHeader-drawerDiv'} >
                        My Groups
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

              {window.EVENT_URL && <React.Fragment><a href={_.unescape(window.EVENT_URL)}>
                <div className={'SubHeader-drawerDiv'} >
                  Event
                </div>
              </a>
              <Divider />
              </React.Fragment>}

              <a href={this.state.createProjectUrl}>
                <div className={'SubHeader-drawerDiv'} >
                  Create Project
                </div>
              </a>
              <Divider />
  
              { CurrentUser.isStaff() && <React.Fragment><a href={url.section(Section.CreateEvent)}>
                <div className={'SubHeader-drawerDiv'} >
                  Create Event
                </div>
              </a>
              <Divider />
              </React.Fragment>}

              <a href={url.section(Section.AboutUs)}>
                <div className={'SubHeader-drawerDiv'} >
                  About Us
                </div>
              </a>
              <Divider />

              <a href={url.section(Section.Press)}>
                <div className={'SubHeader-drawerDiv'} >
                  News
                </div>
              </a>
              <Divider />

              {window.BLOG_URL && <React.Fragment><a href={window.BLOG_URL}>
                <div className={'SubHeader-drawerDiv'} >
                  Blog
                </div>
              </a>
              <Divider />
              </React.Fragment>}

              {this._renderHamburgerNavigationLinks()}

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

  _renderHamburgerNavigationLinks(): $ReadOnlyArray<React$Node> {
    //TODO: refactor NavigationLinks to define link behavior on a per-link basis
    return NavigationLinks.list().map((link) => {
      return (
        <React.Fragment key={link.url}>
          <a key={link.url} href={link.url} rel="noopener noreferrer" onClick={NavigationLinks.logClick.bind(this, link)}>
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
    //TODO: Same issue as NavigationLinks, refactor to pass link behavior as part of env variable
    const headerLinks: $ReadOnlyArray<NavigationLink> = NavigationLinks.list().filter((link) => !link.isButton);
    return (
      <React.Fragment>
        {
          headerLinks.map((link) => {
            return (
              <div key={link.url} className="SectionLink-root">
                <a className="SubHeader-anchor" href={link.url} rel="noopener noreferrer" onClick={NavigationLinks.logClick.bind(this, link)}>
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
    const headerButtonLinks: $ReadOnlyArray<React$Node> = NavigationLinks.list().filter((link) => link.isButton);
    return (
      headerButtonLinks.map((link) => {
        return (
          <a key={link.url}
             href={link.url}
             className="SubHeader-donate-btn-container"
             onClick={NavigationLinks.logClick.bind(this, link)}
          >
            <button className="SubHeader-donate-btn">
              {link.name}
            </button>
          </a>
        );
      })
    )
  }

  _renderIcon(): React$Node {
    return (
      !_.isEmpty(CurrentUser.userImgUrl()) ?
        <img className="SubHeader-userImg" src={CurrentUser.userImgUrl()} /> :
        <Person className="SubHeader-userIcon" />
    );
  }

  _renderSectionLinks(): React$Node {
    const SectionsToShow = [
          {
            section: Section.FindProjects,
            title: 'Find Projects',
            showOnlyWhenLoggedIn: false
          },
          {
            section: Section.CreateProject,
            title: 'Create Project',
            showOnlyWhenLoggedIn: false
          },
          {
            section: Section.CreateEvent,
            title: 'Create Event',
            showOnlyWhenLoggedIn: true,
            showAdminOnly: true
          },
          {
            section: Section.MyProjects,
            title: 'My Projects',
            showOnlyWhenLoggedIn: true
          },
          {
            section: Section.EditProfile,
            title: 'My Profile',
            showOnlyWhenLoggedIn: true
          },
          {
            section: Section.AboutUs,
            title: 'About Us',
            showOnlyWhenLoggedIn: false
          },
          {
            section: Section.Press,
            title: 'News',
            showOnlyWhenLoggedIn: false
          }
        ]
      .filter(config => (!config.showOnlyWhenLoggedIn || CurrentUser.isLoggedIn()) && (!config.showAdminOnly || CurrentUser.isStaff()));
    
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

  _showSectionInMainMenu(config: SectionLinkConfigEntry): boolean {
    // Don't show items that require login
    // Only show admin-only options if user is an admin
    return !config.showOnlyWhenLoggedIn && (!config.showAdminOnly || CurrentUser.isStaff());
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
