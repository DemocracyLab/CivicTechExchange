// @flow

import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import cdn from "../utils/cdn.js";
import CurrentUser from "../utils/CurrentUser.js";
import NavigationStore from "../stores/NavigationStore.js";
import React from "react";
import Section from "../enums/Section.js";
import urlHelper from "../utils/url.js";
import AlertHeader from "./AlertHeader.jsx";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import _ from "lodash";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import UserIcon from "../svg/user-circle-solid.svg";

type State = {|
  showMyProjects: boolean,
  showMyGroups: boolean,
  showMyEvents: boolean,
  showHeader: boolean,
  loginUrl: string,
|};

class MainHeader extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore];
  }

  static calculateState(prevState: State): State {
    return {
      showHeader: !urlHelper.argument("embedded"),
      showMyProjects: CurrentUser.hasProjects(),
      showMyGroups: CurrentUser.hasGroups(),
      showMyEvents: CurrentUser.hasEvents(),
      loginUrl: urlHelper.logInThenReturn(),
    };
  }
  // may need activeSection: NavigationStore.getSection() in calculateState, check that

  constructor(): void {
    super();
    this.state = {
      activeSection: NavigationStore.getSection(),
    };

    this._handleHeightChange = this._handleHeightChange.bind(this);
    this.mainHeaderRef = React.createRef();
  }

  componentDidMount() {
    UniversalDispatcher.dispatch({ type: "INIT" });
    if (this.mainHeaderRef && this.mainHeaderRef.current) {
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
        <div className="MainHeader-nav-container">{this._renderNavBar()}</div>
      </div>
    ) : null;
  }

  _renderNavBar() {
    //TODO: Once the blog is 'settled in' remove the conditional, the window.BLOG_URL target, and just hardcode it in.
    return (
      <Navbar collapseOnSelect expand="lg" bg="navlight" variant="light">
        <Navbar.Brand>
          <a href={urlHelper.section(Section.Home)}>
            <img src={cdn.image("dl_logo.png")} alt="DemocracyLab - Home" />
          </a>
        </Navbar.Brand>
        {CurrentUser.isLoggedIn() ? null : (
          <Button
            className="MainHeader-showmobile MainHeader-login-button"
            variant="outline-primary"
            href={this.state.loginUrl}
          >
            Log In
          </Button>
        )}
        <Navbar.Toggle aria-controls="nav-pagenav-container" />
        <Navbar.Collapse id="nav-pagenav-container" className="MainHeader-nav-flex">
          <Nav className="MainHeader-usernav ml-auto">
            {CurrentUser.isLoggedIn()
              ? this._renderUserSection()
              : this._renderLogInSection()}
          </Nav>
          <Nav className="MainHeader-pagenav mr-auto">
            {this._renderNavLink(urlHelper.section(Section.Home), "Home")}
            <NavDropdown title="Projects" id="nav-projects">
              {this._renderNavDropdownItem(
                urlHelper.section(Section.FindProjects),
                "Find Projects"
              )}
              {this._renderNavDropdownItem(
                urlHelper.section(Section.CreateProject),
                "Create Project"
              )}
            </NavDropdown>
            <NavDropdown title="Groups" id="nav-group">
              {this._renderNavDropdownItem(
                urlHelper.section(Section.FindGroups),
                "Find Groups"
              )}
              {this._renderNavDropdownItem(
                urlHelper.section(Section.CreateGroup),
                "Create Group"
              )}
            </NavDropdown>
            {this._renderEventNavItems()}
            {this._renderNavLink(
              urlHelper.section(Section.Companies),
              "Companies"
            )}
            <NavDropdown title="About" id="nav-about">
              {this._renderNavDropdownItem(
                urlHelper.section(Section.AboutUs),
                "About Us"
              )}
              {this._renderNavDropdownItem(
                urlHelper.section(Section.ContactUs),
                "Contact Us"
              )}
            </NavDropdown>
            {window.BLOG_URL ? (
              <Nav.Link href={window.BLOG_URL}>Blog</Nav.Link>
            ) : null}
            {this._renderNavLink(
              urlHelper.section(Section.Donate),
              "Donate",
              "MainHeader-showmobile"
            )}
            {CurrentUser.isLoggedIn() ? (
              <Nav.Link className="MainHeader-showmobile mb-3" href="/logout/">
                Log Out
              </Nav.Link>
            ) : (
              <Nav.Link
                className="MainHeader-showmobile"
                href={this.state.loginUrl}
              >
                Log In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  _renderEventNavItems(): ?React$Node {
    const eventLinks: Array<React$Node> = [];
    eventLinks.push(
      this._renderNavDropdownItem(
        urlHelper.section(Section.FindEvents),
        "Find Events"
      )
    );
    if (CurrentUser.isStaff()) {
      eventLinks.push(
        this._renderNavDropdownItem(
          urlHelper.section(Section.CreateEvent),
          "Create Event"
        )
      );
    }
    if (window.EVENT_URL) {
      eventLinks.push(
        <NavDropdown.Item href={_.unescape(window.EVENT_URL)}>
          Our Next Event
        </NavDropdown.Item>
      );
    }
    return !_.isEmpty(eventLinks) ? (
      <NavDropdown title="Events" id="nav-events">
        {eventLinks}
      </NavDropdown>
    ) : null;
  }

  _renderLogInSection() {
    //This is desktop only for now, mobile has a different solution
    return (
      <React.Fragment>
        <Button
          className="MainHeader-showdesktop MainHeader-donate-link"
          variant="link"
          href={urlHelper.section(Section.Donate)}
        >
          Donate
        </Button>
        <Button
          className="MainHeader-showdesktop MainHeader-login-button"
          variant="outline-primary"
          href={this.state.loginUrl}
        >
          Log In
        </Button>
      </React.Fragment>
    );
  }

  //TODO: Refactor these to reduce duplication
  _renderNavLink(url: string, text: string, classes: string = "") {
    const section: string = urlHelper.getSection(url);
    const _classes: string = this._addHighlightClassIfApplicable(
      section,
      classes
    );
    return (
      <Nav.Link className={_classes} href={url} key={section}>
        {text}
      </Nav.Link>
    );
  }
  _renderNavDropdownItem(url: string, text: string, classes: string = "") {
    const section: string = urlHelper.getSection(url);
    const _classes: string = this._addHighlightClassIfApplicable(
      section,
      classes
    );
    return (
      <NavDropdown.Item className={_classes} href={url} key={section}>
        {text}
      </NavDropdown.Item>
    );
  }
  _addHighlightClassIfApplicable(section: Section, classes: string): string {
    return (
      classes +
      (section === this.state.activeSection ? " MainHeader-active" : "")
    );
  }

  _renderUserSection() {
    let showMyProjects = this.state.showMyProjects;
    let showMyGroups = this.state.showMyGroups;
    let showMyEvents = this.state.showMyEvents;
    //for logged in users, render user actions
    //TODO: Rebuild this component so deskop dropdown and mobile links aren't separated out
    return (
      <React.Fragment>
        <Nav.Item className="MainHeader-donate-loggedin-container MainHeader-showdesktop">
          <Button
            variant="outline-secondary"
            className="MainHeader-donatebutton"
            href={urlHelper.section(Section.Donate)}
          >
            Donate
          </Button>
        </Nav.Item>
        <Dropdown as={Nav.Item} className="MainHeader-showdesktop">
          <Dropdown.Toggle as={Nav.Link}>
            {this._renderAvatar()} {CurrentUser.firstName()}{" "}
            {CurrentUser.lastName()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {showMyProjects &&
              this._renderNavDropdownItem(
                urlHelper.section(Section.MyProjects),
                "My Projects"
              )}
            {showMyGroups &&
              this._renderNavDropdownItem(
                urlHelper.section(Section.MyGroups),
                "My Groups"
              )}
            {showMyEvents &&
              this._renderNavDropdownItem(
                urlHelper.section(Section.MyEvents),
                "My Events"
              )}
            {this._renderNavDropdownItem(
              urlHelper.section(Section.Profile, { id: CurrentUser.userID() }),
              "My Profile"
            )}
            <Dropdown.Item href="/logout/">Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className="MainHeader-showmobile">
          <Nav.Item className="mt-3">
            {this._renderAvatar()} {CurrentUser.firstName()}{" "}
            {CurrentUser.lastName()}
          </Nav.Item>
          {showMyProjects &&
            this._renderNavLink(
              urlHelper.section(Section.MyProjects),
              "My Projects"
            )}
          {showMyGroups &&
            this._renderNavLink(
              urlHelper.section(Section.MyGroups),
              "My Groups"
            )}
          {showMyEvents &&
            this._renderNavLink(
              urlHelper.section(Section.MyEvents),
              "My Events"
            )}
          {this._renderNavLink(
            urlHelper.section(Section.Profile, { id: CurrentUser.userID() }),
            "My Profile"
          )}
          <Dropdown.Divider />
        </div>
      </React.Fragment>
    );
  }

  _renderAvatar(): React$Node {
    return !_.isEmpty(CurrentUser.userImgUrl()) ? (
      <img className="MainHeader-useravatar" src={CurrentUser.userImgUrl()} />
    ) : (
      <UserIcon className="MainHeader-useravatar" />
    );
  }

  _onAlertHeaderUpdate() {
    this._handleHeightChange(this.mainHeaderRef.current.clientHeight);
  }

  _handleHeightChange(height: number) {
    // Use setTimeout with a delay of 0 ms to break the dispatch chain
    setTimeout(() => {
      UniversalDispatcher.dispatch({
        type: "SET_HEADER_HEIGHT",
        headerHeight: height,
      });
    }, 0);
    this.props.onMainHeaderHeightChange(height);
  }

  _handleAlertClosing() {
    let header = this.mainHeaderRef.current;
    this._handleHeightChange(
      header.clientHeight - header.firstChild.clientHeight
    );
  }
}

export default Container.create(MainHeader);
