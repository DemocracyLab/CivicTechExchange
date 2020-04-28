// @flow

import type { FluxReduceStore } from 'flux/utils';
import type { SectionType } from '../enums/Section.js';
import { Container } from 'flux/utils';
import cdn from "../utils/cdn.js";
import CurrentUser from '../utils/CurrentUser.js';
import NavigationLinks, {NavigationLink} from "../utils/NavigationLinks.js";
import NavigationStore from '../stores/NavigationStore.js'
import SectionLinkConfigs from '../configs/SectionLinkConfigs.js';
import SectionLink from './SectionLink.jsx';
import React from 'react';
import Section from '../enums/Section.js'
import url from '../utils/url.js'
import AlertHeader from "./AlertHeader.jsx";
import MyProjectsStore, {MyProjectsAPIResponse} from "../stores/MyProjectsStore.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import _ from 'lodash';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import UserIcon from '../svg/user-circle-solid.svg';

class MainHeader extends React.Component<{||}, State > {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore, MyProjectsStore];
  }

  static calculateState(prevState: State): State {
    const myProjects: MyProjectsAPIResponse = MyProjectsStore.getMyProjects();
    return {
      showMyProjects: myProjects && (!_.isEmpty(myProjects.volunteering_projects) || !_.isEmpty(myProjects.owned_projects))
    };
  }


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
    this._handleHeightChange(this.mainHeaderRef.current.clientHeight);
  }



  render(): React$Node {
    return (
      <div ref={this.mainHeaderRef} className="MainHeader-root">
        <AlertHeader
          onAlertClose={this._handleAlertClosing.bind(this)}
          onUpdate={this._onAlertHeaderUpdate.bind(this)}
        />
        <div className="MainHeader-nav-container">
          {this._renderNavBar()}
        </div>
      </div>
    );
  }

  _renderNavBar() {
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
            <Nav.Link href={url.section(Section.Home)}>Home</Nav.Link>
            <NavDropdown title="Projects" id="nav-projects">
              <NavDropdown.Item href={url.section(Section.FindProjects)}>Find Projects</NavDropdown.Item>
              <NavDropdown.Item href={url.section(Section.CreateProject)}>Create Project</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Groups" id="nav-groups">
              <NavDropdown.Item href="">Find Groups</NavDropdown.Item>
              <NavDropdown.Item href="">Create Groups</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Events" id="nav-events">
              <NavDropdown.Item href="">Find Events</NavDropdown.Item>
              <NavDropdown.Item href="">Create Events</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="About" id="nav-about">
              <NavDropdown.Item href={url.section(Section.AboutUs)}>About Us</NavDropdown.Item>
              <NavDropdown.Item href={url.section(Section.ContactUs)}>Contact Us</NavDropdown.Item>
              <NavDropdown.Item href={url.section(Section.Press)}>News</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="https://blog.democracylab.org">Blog</Nav.Link>
            <Nav.Link href={url.section(Section.Donate)} className="MainHeader-showmobile">Donate</Nav.Link>
            {CurrentUser.isLoggedIn() ? <Nav.Link className="MainHeader-showmobile" href="/logout/">Log Out</Nav.Link> : <Nav.Link className="MainHeader-showmobile" href={url.section(Section.LogIn, url.getPreviousPageArg())}>Log In</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  _renderLogInSection() {
    //for logged out users, render login and similar
    //This is "desktop only" right now, see if we can combine it with mobile somehow?
    return (
      <React.Fragment>
        <Button className="MainHeader-showdesktop MainHeader-donate-link" variant="link" href={url.section(Section.Donate)}>Donate</Button>
        <Button className="MainHeader-showdesktop MainHeader-login-button" variant="outline-primary" href={url.section(Section.LogIn, url.getPreviousPageArg())}>Log In</Button>
      </React.Fragment>
    )
  }

  _renderNavLink(sec, text, type, classes = "") {
    //sec = url.section to go to
   // text = displayed link text
   // type = Dropdown or Link
   // classes (optional) any additional classnames that should be appended
   // this helper method should also look at state.activesection and append an active class where url.section matches
   // _renderNavLink("FindProjects", "Find Projects", "Dropdown")
   if (type === "Dropdown") {
     return <NavDropdown.Item className={classes} href={url.section(Section.sec)}>{text}</NavDropdown.Item>
   }
   if (type === "Link") {
     return <Nav.Link className={classes} href={url.section(Section.sec)}>{text}</Nav.Link>
   }
  }

  _renderUserSection() {
    //for logged in users, render user actions
    //TODO: Rebuild this component so deskop dropdown and mobile links aren't separated out
    // Note that mobile does not have a Log Out link because it's rendered in the main nav for positioning purposes
    return (
      <React.Fragment>
        <Nav.Item as="button" className="btn btn-outline-secondary MainHeader-showdesktop MainHeader-donatebutton" href={url.section(Section.Donate)}>Donate</Nav.Item>
        <Dropdown as={Nav.Item} className="MainHeader-showdesktop">
          <Dropdown.Toggle as={Nav.Link}>
            {this._renderAvatar()} {CurrentUser.firstName()} {CurrentUser.lastName()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href={url.section(Section.MyProjects)}>My Projects</Dropdown.Item>
            <Dropdown.Item href={url.section(Section.EditProfile)}>My Profile</Dropdown.Item>
            <Dropdown.Item href="/logout/">Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className="MainHeader-showmobile">
          <Nav.Item>{this._renderAvatar()} {CurrentUser.firstName()} {CurrentUser.lastName()}</Nav.Item>
          <Nav.Link href={url.section(Section.MyProjects)}>My Projects</Nav.Link>
          <Nav.Link href={url.section(Section.EditProfile)}>My Profile</Nav.Link>
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
