// @flow
// https://stackoverflow.com/questions/42635126/bootstrap-4-navbar-with-2-rows/42635243#42635243
// https://www.codeply.com/go/26lFpoCSWx

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
import Button from 'react-bootstrap/Button';

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
      showMyProjects: false,
      createProjectUrl: url.sectionOrLogIn(Section.CreateProject)
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
        {CurrentUser.isLoggedIn() ? null : <Button className="MainHeader-showmobile MainHeader-login-button" variant="outline-primary" href={url.section(Section.LogIn)}>Log In</Button>}
        <Navbar.Toggle aria-controls="nav-pagenav-container" />
        <Navbar.Collapse id="nav-pagenav-container" className="flex-column">
          <Nav className="MainHeader-usernav ml-auto">
            {CurrentUser.isLoggedIn() ? this._renderUserSection() : this._renderLogInSection()}
          </Nav>
          <Nav className="MainHeader-pagenav mr-auto">
            <NavDropdown title="Projects" id="nav-projects">
              <NavDropdown.Item href={url.section(Section.FindProjects)}>Find Projects</NavDropdown.Item>
              <NavDropdown.Item href={url.section(Section.CreateProject)}>Create Project</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Groups" id="nav-groups">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Events" id="nav-events">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="About" id="nav-about">
              <NavDropdown.Item href={url.section(Section.AboutUs)}>About Us</NavDropdown.Item>
              <NavDropdown.Item href={url.section(Section.ContactUs)}>Contact Us</NavDropdown.Item>
              <NavDropdown.Item href={url.section(Section.Press)}>News</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href={url.section(Section.Donate)} className="MainHeader-showmobile">Donate</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  _renderLogInSection() {
    //for logged out users, render login and similar
    return (
      <React.Fragment>
        <Nav.Item as="button" className="btn btn-outline-secondary MainHeader-showdesktop" href={url.section(Section.Donate)}>Donate</Nav.Item>
        <Nav.Link href={url.section(Section.LogIn)}>Log In</Nav.Link>
      </React.Fragment>
    )
  }

  _renderUserSection() {
    //for logged in users, render user actions
    return (
      <React.Fragment>
        <Nav.Item as="button" className="btn btn-outline-secondary MainHeader-showdesktop" href={url.section(Section.Donate)}>Donate</Nav.Item>
        <Nav.Link href={url.section(Section.MyProjects)}>My Projects</Nav.Link>
        <Nav.Link href="/logout/">Log Out</Nav.Link>
      </React.Fragment>
    )
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
