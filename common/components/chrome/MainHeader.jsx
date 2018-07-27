// @flow

import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import Section from '../enums/Section.js';
import CurrentUser from '../utils/CurrentUser.js';
import url from '../utils/url.js';

class MainHeader extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="MainHeader-root">
        <span onClick={this._onHomeButtonClick}>
          <img
            className="MainHeader-logo"
            src="https://i.imgur.com/NhoAjjN.png"
          />
        </span>
        <span className="MainHeader-rightContent">
          {this._renderHero()}
        </span>
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

  _renderHero(): React$Node {
    return CurrentUser.isLoggedIn()
      ? (
        <DropdownButton
          style={{cursor: "pointer",  textDecoration: "none", color: "black"}}
          bsStyle="link"
          title={CurrentUser.firstName() + ' ' + CurrentUser.lastName()}
          noCaret
          id="dropdown-no-caret"
        >
          <MenuItem href="mailto:hello@democracylab.org">Contact Us</MenuItem>
          <MenuItem divider />
          <MenuItem href="/logout">Logout</MenuItem>
        </DropdownButton>
          )
      : (
          <span className = "MainHeader-links">
            <a href="mailto:hello@democracylab.org">Contact Us</a> |{' '}
            <a href = {url.section(Section.LogIn)} > Log In </a> |{' '}
            <a href = {url.section(Section.SignUp)} > Sign Up </a> |{' '}
            <a href = {url.section(Section.ResetPassword)} > Forgot Password </a>
          </span>
        );
  }
}

export default MainHeader;
