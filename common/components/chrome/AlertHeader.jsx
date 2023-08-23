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
import { differenceInMilliseconds, milliseconds, add } from "date-fns";
import type { duration } from "../utils/datetime.js";
import datetime from "../utils/datetime.js";

type AlertShownStats = {|
  lastHidden: number /* Time since alert was last hidden in Milliseconds */,
|};

type AlertConfiguration = {|
  name: string /* Identifier for tracking AlertShownStats in session storage */,
  waitTimeBeforeShowAgain: ?duration /* duration object */,
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
        waitTimeBeforeShowAgain: { minutes: 1 },
        shouldShowAlert: () => {
          return CurrentUser.isLoggedIn() && !CurrentUser.isEmailVerified();
        },
        getAlertBody: this._renderEmailNotVerifiedAlert.bind(this),
      },
      {
        name: "renewVolunteeringAlert",
        waitTimeBeforeShowAgain: { days: 1 },
        shouldShowAlert: () => {
          return CurrentUser.isVolunteeringUpForRenewal();
        },
        getAlertBody: this._renderVolunteerUpForRenewal.bind(this),
      },
      {
        name: "eventAlert",
        waitTimeBeforeShowAgain: { days: 1 },
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

  componentWillUpdate(nextProps: Props, nextState: State) {
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
        lastHidden: Date.now(),
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

    const durationSinceLastHidden = differenceInMilliseconds(
      new Date(),
      new Date(alertShownStats.lastHidden)
    );
    const durationBeforeShowAgain = milliseconds(
      alertConfig.waitTimeBeforeShowAgain
    );
    return durationSinceLastHidden > durationBeforeShowAgain;
  }

  render(): ?React$Node {
    console.log("kst alert 4");
    // console.log(
    //   "kst datefn: " +
    //     datetime.getDisplayDistance(
    //       new Date(),
    //       new Date("2023-08-14T16:25:20.946Z")
    //     )
    // );
    // console.log("kst moment: " + moment("2023-08-14T16:25:20.946Z").fromNow());
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
    const message: string = url.decodeNameFromUrlPassing(
      AlertMessages[key].replace("{value}", url.argument(key))
    );
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
