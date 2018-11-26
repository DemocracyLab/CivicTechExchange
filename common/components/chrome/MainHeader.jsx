// @flow

import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Section from '../enums/Section.js';
import CurrentUser from '../utils/CurrentUser.js';
import url from '../utils/url.js';
import FooterLinks from "../utils/FooterLinks.js";
import cdn from "../utils/cdn.js";

import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography'

type State = {|
  left: boolean,

|};

class MainHeader extends React.PureComponent<{||}> {

  constructor(): void {
    super();
    this.state = {
      left: false
    };
    this._toggleDrawer = this._toggleDrawer.bind(this);
  }




  render(): React$Node {
    return (
      <div className="MainHeader-root">
        <span onClick={this._onHomeButtonClick}>
          <img
            className="MainHeader-logo"
            src={cdn.image("dl_logo.png")}
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
        <React.Fragment>

          <div className="MainHeader-hamburger" onClick={() => this._toggleDrawer('left', true)}>
            <IconButton >
              <MenuIcon />
            </IconButton>
          </div>

          <Drawer open={this.state.left} onClose={() => this._toggleDrawer('left', false)}>
            <div
              tabIndex={0}
              role="button"
              onClick={() => this._toggleDrawer('left', false)}
              onKeyDown={() => this._toggleDrawer('left', false)}
            >
              <div className="MainHeader-navDrawer">
                <Typography className="MainHeader-name" variant='overline'>{CurrentUser.firstName() + ' ' + CurrentUser.lastName()}</Typography>
                {this._renderFooterDrawerLinks()}
                <a href="/logout/">
                  <div className={'MainHeader-drawerDiv'}>
                    Logout
                  </div>
                </a>
              </div>
            </div>
          </Drawer>

          <DropdownButton
            className="MainHeader-dropdownButton"
            bsStyle="link"
            title={CurrentUser.firstName() + ' ' + CurrentUser.lastName()}
            noCaret
            id="dropdown-no-caret"
          >
            {this._renderFooterMenuLinks()}
            <MenuItem divider />
            <MenuItem href="/logout/">Logout</MenuItem>
          </DropdownButton>
        </React.Fragment>

      )
      : (
        <React.Fragment>

          <div className="MainHeader-hamburger" onClick={() => this._toggleDrawer('left', true)}>
            <IconButton >
              <MenuIcon />
            </IconButton>
          </div>

          <Drawer open={this.state.left} onClose={() => this._toggleDrawer('left', false)}>
            <div
              tabIndex={0}
              role="button"
              onClick={() => this._toggleDrawer('left', false)}
              onKeyDown={() => this._toggleDrawer('left', false)}
            >
              <div className="MainHeader-navDrawer">
                {this._renderFooterDrawerLinks()}
                <div className={'MainHeader-drawerDiv'} onClick={this._onLogInClick}>
                  <a href="" > Log In </a>
                </div>
                <Divider />
                <div className={'MainHeader-drawerDiv'} onClick={this._onSignUpClick} >
                  <a href="" > Sign Up </a>
                </div>
                <Divider />
                <div className={'MainHeader-drawerDiv'} onClick={this._onResetPasswordClick} >
                  <a href="" > Forgot Password </a>
                </div>
              </div>
            </div>
          </Drawer>

          <span className="MainHeader-links">
            {this._renderFooterLinks()}
            <span onClick={this._onLogInClick}>
              <a href="" > Log In </a>
            </span> |{' '}

            <span onClick={this._onSignUpClick} >
              <a href="" > Sign Up </a>
            </span> |{' '}

            <span onClick={this._onResetPasswordClick} >
              <a href="" > Forgot Password </a>
            </span>
          </span>
        </ React.Fragment>
      );
  }

  _toggleDrawer(side: string, open: boolean): void {
    this.setState({ [side]: open })
  }

  _renderFooterLinks(): $ReadOnlyArray<React$Node> {
    return FooterLinks.list().map((link, i) => {
      return <span key={i}><a href={link.url}>{link.name}</a> |{' '}</span>
    });
  }

  _renderFooterMenuLinks(): $ReadOnlyArray<React$Node> {
    return FooterLinks.list().map((link, i) => {
      return <MenuItem href={link.url} key={i}>{link.name}</MenuItem>
    });
  }

  _renderFooterDrawerLinks(): $ReadOnlyArray<React$Node> {
    return FooterLinks.list().map((link, i) => {
      return (
        <React.Fragment>
          <a href={link.url}><div className='MainHeader-drawerDiv' key={i}>{link.name}</div></a>
          <Divider />
        </React.Fragment>
      )
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
