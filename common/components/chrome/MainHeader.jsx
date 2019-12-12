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
      <div ref={this.mainHeaderRef} className="MainHeader">
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
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
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
