// @flow

import type {SectionType} from '../enums/Section.js';

import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
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
          <span>
            {/* {this._renderLinks()} */}
          </span>
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
        <span>
          {CurrentUser.firstName() + ' ' + CurrentUser.lastName() + ' '}
          | <a href="/logout">Logout</a>
        </span>
            ) :
            (
            <span className = "MainHeader-links">
                <span onClick = {this._onLogInClick}>
                <a href = "" > Log In </a>
                </span>

                <span onClick = {this._onSignUpClick} >
                <a href = "" > Sign Up < /a>
                </span>

                <a href = "/password_reset" > Forgot Password < /a>
            </span>
            );
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

  // _renderLinks(): React$Node {
  //   return [
  //     'About',
  //     'Notifications',
  //     'Messages',
  //   ].map(link => <span className="MainHeader-link" key={link}>{link}</span>);
  // }
}

export default MainHeader;
