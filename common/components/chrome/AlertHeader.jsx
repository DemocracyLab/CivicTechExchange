// @flow

import React from "react";
import { Container } from "flux/utils";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";
import { Dictionary } from "../types/Generics.jsx";
import CurrentUser from "../utils/CurrentUser.js";
import url from "../utils/url.js";
import utils from "../utils/utils.js";
import Section from "../enums/Section.js";
import NavigationStore from "../stores/NavigationStore.js";
import moment from "moment";
import _ from "lodash";

type AlertShownStats = {|
  lastHidden: number /* Time since alert was last hidden in Milliseconds */,
|};

type AlertConfiguration = {|
  name: string /* Identifier for tracking AlertShownStats in session storage */,
  waitTimeBeforeShowAgain: ?string /* ISO 8601 duration string */,
  shouldShowAlert: () => boolean /* Whether to show alert */,
  getAlertBody: () => React$Node /* Alert HTML body */,
|};

type Props = {|
  onClickFindProjects: () => void,
  onAlertClose: () => void,
  onUpdate: () => void,
|};

type State = {|
  showHeader: boolean,
  alertConfigurations: $ReadOnlyArray<AlertConfiguration>,
  currentAlert: AlertConfiguration,
|};

const AlertMessages: Dictionary<string> = {
  projectAwaitingApproval:
    'Your project "{value}" is awaiting approval.  Expect a decision in the next business day.',
  eventAwaitingApproval:
    'Your event "{value}" is awaiting approval.  Expect a decision in the next business day.',
  groupAwaitingApproval:
    'Your group "{value}" is awaiting approval.  Expect a decision in the next business day.',
};

class AlertHeader extends React.Component<Props, State> {
  constructor(): void {
    super();
    const alertConfigurations: $ReadOnlyArray<AlertConfiguration> = [
      {
        name: "triggeredAlertMessages",
        shouldShowAlert: () => {
          return _.some(_.keys(AlertMessages), key => url.argument(key));
        },
        getAlertBody: this._renderTriggeredAlert.bind(this),
      },
      {
        name: "emailVerificationAlert",
        waitTimeBeforeShowAgain: "PT1M" /* 1 Minute */,
        shouldShowAlert: () => {
          return CurrentUser.isLoggedIn() && !CurrentUser.isEmailVerified();
        },
        getAlertBody: this._renderEmailNotVerifiedAlert.bind(this),
      },
      {
        name: "renewVolunteeringAlert",
        waitTimeBeforeShowAgain: "P1D" /* 1 day */,
        shouldShowAlert: () => {
          return CurrentUser.isVolunteeringUpForRenewal();
        },
        getAlertBody: this._renderVolunteerUpForRenewal.bind(this),
      },
      {
        name: "eventAlert",
        waitTimeBeforeShowAgain: "P1D" /* 1 day */,
        shouldShowAlert: () => {
          return window.HEADER_ALERT;
        },
        getAlertBody: this._renderBackendAlert.bind(this),
      },
    ];
    const currentAlert = this.getCurrentAlert(alertConfigurations);
    this.state = {
      currentAlert: currentAlert,
      showHeader: !_.isEmpty(currentAlert),
      alertConfigurations: alertConfigurations,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore];
  }

  static calculateState(prevState: State): State {
    // Re-calculate the current alert if we navigate to a different section
    return {
      currentAlert: null,
    };
  }

  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {
    if (!nextState.currentAlert) {
      this.setState({
        currentAlert: this.getCurrentAlert(this.state.alertConfigurations),
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.currentAlert !== prevState.currentAlert) {
      this.props.onUpdate();
    }
  }

  hideHeader(): void {
    url.removeArgs(_.keys(AlertMessages));
    if (this.state.currentAlert.waitTimeBeforeShowAgain) {
      const alertShownStats: AlertShownStats = {
        lastHidden: moment.now().valueOf(),
      };

      sessionStorage[this.state.currentAlert.name] = JSON.stringify(
        alertShownStats
      );
    }
    this.setState({ showHeader: false });
    this.props.onAlertClose();
  }

  getCurrentAlert(
    alertConfigurations: $ReadOnlyArray<AlertConfiguration>
  ): AlertHeader {
    const currentAlert: AlertConfiguration = alertConfigurations.find(
      alertConfig => {
        return (
          alertConfig.shouldShowAlert() &&
          this.shouldShowAlertAgain(alertConfig)
        );
      }
    );

    return currentAlert;
  }

  shouldShowAlertAgain(alertConfig: AlertConfiguration): boolean {
    const alertShownStats: AlertShownStats =
      sessionStorage[alertConfig.name] &&
      JSON.parse(sessionStorage[alertConfig.name]);
    if (!alertShownStats) {
      return true;
    }

    const durationSinceLastHidden = moment.duration(
      moment().diff(moment(alertShownStats.lastHidden))
    );
    const durationBeforeShowAgain = moment.duration(
      alertConfig.waitTimeBeforeShowAgain
    );
    return durationSinceLastHidden > durationBeforeShowAgain;
  }

  render(): ?React$Node {
    return this.state.showHeader && this.state.currentAlert ? (
      <div className="AlertHeader-root">
        {this._renderCurrentAlert()}
        <div className="AlertHeader-close" onClick={() => this.hideHeader()}>
          <i
            className={Glyph(GlyphStyles.Close, GlyphSizes.LG)}
            aria-hidden="true"
          ></i>
        </div>
      </div>
    ) : null;
  }

  _renderCurrentAlert(): React$Node {
    return this.state.currentAlert.getAlertBody();
  }

  _renderTriggeredAlert(): React$Node {
    const key: string = _.keys(AlertMessages).find(key => url.argument(key));
    const message: string = url.decodeNameFromUrlPassing(AlertMessages[key].replace(
       "{value}", url.argument(key)
     ));
    return <div className="AlertHeader-text">{message}</div>;
  }

  _renderBackendAlert(): React$Node {
    return (
      <div
        className="AlertHeader-text"
        dangerouslySetInnerHTML={{
          __html: utils.unescapeHtml(window.HEADER_ALERT),
        }}
      />
    );
  }

  _renderEmailNotVerifiedAlert(): React$Node {
    return (
      <div className="AlertHeader-text">
        You have not verified your email yet. Please check your email and click
        on the link to verify your account. Didn't get an email? {}
        <a href="/verify_user">Resend verification email</a>
      </div>
    );
  }

  _renderVolunteerUpForRenewal(): React$Node {
    return (
      <div className="AlertHeader-text">
        You are approaching the end date for one or more projects you are
        volunteering with. {}
        <a href={url.section(Section.MyProjects)}>
          Review Volunteer Commitments
        </a>
      </div>
    );
  }
}
export default Container.create(AlertHeader);
