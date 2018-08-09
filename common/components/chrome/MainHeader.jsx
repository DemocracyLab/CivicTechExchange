// @flow

import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import Section from '../enums/Section.js';
import CurrentUser from '../utils/CurrentUser.js';
import url from '../utils/url.js';
import FooterLinks from "../utils/FooterLinks.js";

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
          {this._renderFooterMenuLinks()}
          <MenuItem divider />
          <MenuItem href="/logout">Logout</MenuItem>
        </DropdownButton>
          )
      : (
          <span className = "MainHeader-links">
            {this._renderFooterLinks()}
            <span onClick = {this._onLogInClick}>
              <a href = "" > Log In </a>
            </span> |{' '}

            <span onClick = {this._onSignUpClick} >
              <a href = "" > Sign Up </a>
            </span> |{' '}

            <span onClick = {this._onResetPasswordClick} >
              <a href = "" > Forgot Password </a>
            </span>
          </span>
        );
  }
  
  _renderFooterLinks(): $ReadOnlyArray<React$Node> {
    return FooterLinks.list().map((link,i) => {
      return <span key={i}><a href={link.url}>{link.name}</a> |{' '}</span>
    });
  }
  
  _renderFooterMenuLinks(): $ReadOnlyArray<React$Node> {
    return FooterLinks.list().map((link,i) => {
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

  _onSignUpClick(): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: Section.SignUp,
      url: url.section(Section.SignUp)
    });
  }
  
  _onResetPasswordClick(): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: Section.ResetPassword,
      url: url.section(Section.ResetPassword)
    });
  }
}

export default MainHeader;
