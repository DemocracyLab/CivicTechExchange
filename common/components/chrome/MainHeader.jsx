// @flow

import type { FluxReduceStore } from 'flux/utils';
import type { SectionType } from '../enums/Section.js';
import { Container } from 'flux/utils';
import cdn from "../utils/cdn.js";
import CurrentUser from '../utils/CurrentUser.js';
import NavigationLinks, {NavigationLink} from "../utils/NavigationLinks.js";
import NavigationStore from '../stores/NavigationStore.js'
import SectionLink from './SectionLink.jsx';
import React from 'react';
import Section from '../enums/Section.js'
import url from '../utils/url.js'
import AlertHeader from "./AlertHeader.jsx";
import MyProjectsStore, {MyProjectsAPIResponse} from "../stores/MyProjectsStore.js";
import MyGroupsStore, {MyGroupsAPIResponse} from "../stores/MyGroupsStore.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import _ from 'lodash';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import UserIcon from '../svg/user-circle-solid.svg';

type State = {|
  showMyProjects: boolean,
  showMyGroups: boolean,
  showHeader: boolean
|};


class MainHeader extends React.Component<{||}, State > {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore, MyProjectsStore];
  }

  static calculateState(prevState: State): State {
    const myProjects: MyProjectsAPIResponse = MyProjectsStore.getMyProjects();
    const myGroups: MyGroupsAPIResponse = MyGroupsStore.getMyGroups();
    return {
      showHeader: !url.argument("embedded"),
      showMyProjects: myProjects && (!_.isEmpty(myProjects.volunteering_projects) || !_.isEmpty(myProjects.owned_projects)),
      showMyGroups: myGroups && (!_.isEmpty(myGroups.owned_groups))
    };
  }
  // may need activeSection: NavigationStore.getSection() in calculateState, check that



  constructor(): void {
    super();
    this.state = {
      activeSection: NavigationStore.getSection()
    };

    this._handleHeightChange = this._handleHeightChange.bind(this);
    this.mainHeaderRef = React.createRef();
  }

  componentDidMount() {
    UniversalDispatcher.dispatch({type: 'INIT'});
    if(this.mainHeaderRef && this.mainHeaderRef.current) {
      this._handleHeightChange(this.mainHeaderRef.current.clientHeight);
    }
  }



  render(): React$Node {
    return this.state.showHeader ? (
      <div ref={this.mainHeaderRef} className="MainHeader-root">
        <AlertHeader
          onAlertClose={this._handleAlertClosing.bind(this)}
          onUpdate={this._onAlertHeaderUpdate.bind(this)}
        />
        <div className="MainHeader-nav-container">
          {this._renderNavBar()}
        </div>
      </div>
    ) : null;
  }

  _renderNavBar() {
    //TODO: Once the blog is 'settled in' remove the conditional, the window.BLOG_URL target, and just hardcode it in.
    return (
      <Navbar collapseOnSelect expand="lg" bg="navlight" variant="light">
        <Navbar.Brand><a href={url.section(Section.Home)}><img src={cdn.image("dl_logo.png")} alt="DemocracyLab" /></a></Navbar.Brand>
        {CurrentUser.isLoggedIn() ? null : <Button className="MainHeader-showmobile MainHeader-login-button" variant="outline-primary" href={url.section(Section.LogIn, url.getPreviousPageArg())}>Log In</Button>}
        <Navbar.Toggle aria-controls="nav-pagenav-container" />
        <Navbar.Collapse id="nav-pagenav-container" className="flex-column">
          <Nav className="MainHeader-usernav ml-auto">
            {CurrentUser.isLoggedIn() ? this._renderUserSection() : this._renderLogInSection()}
          </Nav>
          <Nav className="MainHeader-pagenav mr-auto">
            {this._renderNavLink(Section.Home, "Home")}
            <NavDropdown title="Projects" id="nav-projects">
              {this._renderNavDropdownItem(Section.FindProjects, "Find Projects")}
              {this._renderNavDropdownItem(Section.CreateProject, "Create Project")}
            </NavDropdown>
            <NavDropdown title="Groups" id="nav-group">
              {this._renderNavDropdownItem(Section.FindGroups, "Find Groups")}
              {this._renderNavDropdownItem(Section.CreateGroup, "Create Group")}
            </NavDropdown>
            {this._renderEventNavItems()}
            <NavDropdown title="About" id="nav-about">
              {this._renderNavDropdownItem(Section.AboutUs, "About Us")}
              {this._renderNavDropdownItem(Section.ContactUs, "Contact Us")}
              {this._renderNavDropdownItem(Section.Press, "News")}
            </NavDropdown>
            {window.BLOG_URL ? <Nav.Link href={window.BLOG_URL}>Blog</Nav.Link> : null}
            {this._renderNavLink(Section.Donate, "Donate", "MainHeader-showmobile")}
            {CurrentUser.isLoggedIn() ? <Nav.Link className="MainHeader-showmobile mb-3" href="/logout/">Log Out</Nav.Link> : <Nav.Link className="MainHeader-showmobile" href={url.section(Section.LogIn, url.getPreviousPageArg())}>Log In</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
  
  _renderEventNavItems(): ?React$Node {
    const eventLinks: Array<React$Node> = [];
    if(CurrentUser.isStaff()) {
      eventLinks.push(this._renderNavDropdownItem(Section.CreateEvent, "Create Event"));
    }
    if(window.EVENT_URL) {
      eventLinks.push(<NavDropdown.Item href={_.unescape(window.EVENT_URL)}>Upcoming Event</NavDropdown.Item>);
    }
    return !_.isEmpty(eventLinks)
    ? (
      <NavDropdown title="Events" id="nav-events">
        {eventLinks}
      </NavDropdown>
    ) : null;
  }

  _renderLogInSection() {
    //This is desktop only for now, mobile has a different solution
    return (
      <React.Fragment>
        <Button className="MainHeader-showdesktop MainHeader-donate-link" variant="link" href={url.section(Section.Donate)}>Donate</Button>
        <Button className="MainHeader-showdesktop MainHeader-login-button" variant="outline-primary" href={url.section(Section.LogIn, url.getPreviousPageArg())}>Log In</Button>
      </React.Fragment>
    )
  }

//TODO: Refactor these to reduce duplication
//TODO: Allow multiple arguments for url.section to handle url.getPreviousPageArg() - options object?
  _renderNavLink(section, text, classes = "") {
    const urlArgs = url.arguments(url.section(section));
    if (urlArgs.section === this.state.activeSection) {
      classes += " MainHeader-active";
    };
    return <Nav.Link className={classes} href={url.section(section)}>{text}</Nav.Link>
  }
  _renderNavDropdownItem(section, text, classes = "") {
    const urlArgs = url.arguments(url.section(section));
    if (urlArgs.section === this.state.activeSection) {
      classes += " MainHeader-active";
    };
    return <NavDropdown.Item className={classes} href={url.section(section)}>{text}</NavDropdown.Item>
  }


  _renderUserSection() {
    let showMyProjects = this.state.showMyProjects;
    let showMyGroups = this.state.showMyGroups
    //for logged in users, render user actions
    //TODO: Rebuild this component so deskop dropdown and mobile links aren't separated out
    return (
      <React.Fragment>
        <Nav.Item as="button" className="btn btn-outline-secondary MainHeader-showdesktop MainHeader-donatebutton" href={url.section(Section.Donate)}>Donate</Nav.Item>
        <Dropdown as={Nav.Item} className="MainHeader-showdesktop">
          <Dropdown.Toggle as={Nav.Link}>
            {this._renderAvatar()} {CurrentUser.firstName()} {CurrentUser.lastName()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {showMyProjects && this._renderNavDropdownItem(Section.MyProjects, "My Projects")}
            {showMyGroups && this._renderNavDropdownItem(Section.MyGroups, "My Groups")}
            {this._renderNavDropdownItem(Section.EditProfile, "Edit Profile")}
            <Dropdown.Item href="/logout/">Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className="MainHeader-showmobile">
          <Nav.Item className="mt-3">{this._renderAvatar()} {CurrentUser.firstName()} {CurrentUser.lastName()}</Nav.Item>
          {showMyProjects && this._renderNavLink(Section.MyProjects, "My Projects")}
          {showMyGroups && this._renderNavLink(Section.MyGroups, "My Groups")}
          {this._renderNavLink(Section.EditProfile, "Edit Profile")}
          <Dropdown.Divider />
        </div>
      </React.Fragment>
    )
  }

  _renderAvatar(): React$Node {
    return (
      !_.isEmpty(CurrentUser.userImgUrl()) ?
        <img className="MainHeader-useravatar" src={CurrentUser.userImgUrl()} /> :
        <UserIcon className="MainHeader-useravatar" />
    );
  }

  _onAlertHeaderUpdate() {
    this._handleHeightChange(this.mainHeaderRef.current.clientHeight);
  }

  _handleHeightChange(height) {
    this.props.onMainHeaderHeightChange(height);
  }

  _handleAlertClosing() {
    let header = this.mainHeaderRef.current;
    this._handleHeightChange(header.clientHeight - header.firstChild.clientHeight);
  }

}

export default Container.create(MainHeader);
