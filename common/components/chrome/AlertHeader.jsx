// @flow

import React from 'react';
import {Glyph,GlyphStyles, GlyphSizes} from "../utils/glyphs.js";
import CurrentUser from "../utils/CurrentUser.js";
import moment from 'moment';
import _ from 'lodash'

type AlertShownStats = {|
  lastShown: ?Date
|};

type AlertConfiguration = {|
  name: string,
  waitTimeBeforeShowAgain: string, /*ISO 8601 duration string*/
  shouldShowAlert: () => boolean,
  getAlertBody: () => React$Node
|};

type Props = {|
  onClickFindProjects: () => void
|};

type State = {|
  showHeader: boolean,
  alertConfigurations: $ReadOnlyArray<AlertConfiguration>,
  currentAlert: AlertConfiguration
|};

// Put string html content into a format that dangerouslySetInnerHTML accepts
function unescapeHtml(html: string): string {
  
  let escapeEl = document.createElement('textarea');
  escapeEl.innerHTML = html;
  return escapeEl.textContent;
}

class AlertHeader extends React.PureComponent<Props, State> {
  constructor(): void {
    super();
    const alertConfigurations: $ReadOnlyArray<AlertConfiguration> = [
      {
        name: "emailVerificationAlert",
        waitTimeBeforeShowAgain: "PT1M" /* 1 Minute */,
        shouldShowAlert: () => {
          return !CurrentUser.isEmailVerified()
        },
        getAlertBody: this._renderEmailNotVerifiedAlert.bind(this)
      }, {
        name: "event",
        waitTimeBeforeShowAgain: "P1D" /* 1 day */,
        shouldShowAlert: () => {
          return window.HEADER_ALERT
        },
        getAlertBody: this._renderBackendAlert.bind(this)
      }
    ];
    const currentAlert = this.getCurrentAlert(alertConfigurations);
    this.state = {
      showHeader: currentAlert !== null,
      currentAlert: currentAlert,
      alertConfigurations: alertConfigurations,
    };
  }
  
  hideHeader(): void {
    const alertShownStats: AlertShownStats = {
      lastShown: moment.now()
    };
    
    sessionStorage[this.state.currentAlert.name] = alertShownStats;
    this.setState({showHeader: false});
  }
  
  getCurrentAlert(alertConfigurations: $ReadOnlyArray<AlertConfiguration>): AlertHeader {
    const currentAlert: AlertConfiguration = alertConfigurations.find((alertConfig) => {
      // TODO: Check cookie to see if it should be hidden
      // const alertShownStats: AlertShownStats = sessionStorage[alertConfig.name];
      // const showedAlertRecently = alertShownStats && (moment.subtract()
      return alertConfig.shouldShowAlert();
    });
    
    return currentAlert;
  }
  
  render(): ?React$Node {
    return this.state.showHeader && (
      <div className="AlertHeader-root">
        {this._renderCurrentAlert()}
        <div className="AlertHeader-close" onClick={() => this.hideHeader()}>
          <i className={Glyph(GlyphStyles.Close,GlyphSizes.LG)} aria-hidden="true"></i>
        </div>
      </div>
    );
  }
  
  _renderCurrentAlert(): React$Node {
    return this.state.currentAlert.getAlertBody();
  }
  
  _renderBackendAlert(): React$Node {
    return <div className="AlertHeader-text" dangerouslySetInnerHTML={{__html: unescapeHtml(window.HEADER_ALERT)}}/>
  }
  
  _renderEmailNotVerifiedAlert(): React$Node {
    return (
      <div className="AlertHeader-text">
        You have not verified your email yet.  Please check your email and click on the link to verify your account.
        Didn't get an email?
        <a href="/verify_user">Resend verification email</a>
      </div>
    );
  }
  
}
export default AlertHeader;
