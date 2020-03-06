// @flow

import React from 'react';
import CurrentUser from "../../utils/CurrentUser.js";
import FacebookSVG from "../../svg/facebook.svg";
import GithubSVG from "../../svg/github.svg";
import GoogleSVG from "../../svg/google.svg";
import LinkedInSVG from "../../svg/linkedin.svg";
import _ from "lodash";

const socialAppVisibility: { [key: string]: boolean } = !_.isEmpty(window.SOCIAL_APPS_VISIBILITY) ? JSON.parse(_.unescape(window.SOCIAL_APPS_VISIBILITY)) : {};

type SocialSignInLinkDisplayConfig = {|
  displayName: string,
  iconClass: ?string,
  iconElement: React$Node
|};

const socialSignInLinkDisplayConfigMap: { [key: string]: SocialSignInLinkDisplayConfig } = {
  linkedin: {
    displayName: "LinkedIn",
    iconElement: <LinkedInSVG />
  }, google: {
    displayName: "Google",
    iconClass: "LogInController-google",
    iconElement: <GoogleSVG />
  }, github: {
    displayName: "GitHub",
    iconElement: <GithubSVG />
  }, facebook: {
    displayName: "Facebook",
    iconElement: <FacebookSVG />
  }
};

type State = {|
  visibleApps: $ReadOnlyArray<string>
|}

class SocialMediaSignupSection extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      visibleApps: CurrentUser.isStaff() ? _.keys(socialAppVisibility) : _.keys(_.pickBy(socialAppVisibility, v => v === true))
    };
  }
  
  render(): ?React$Node {
    return !_.isEmpty(this.state.visibleApps) ? this._renderSocialLoginsSection() : null;
  }
  
  _renderSocialLoginsSection(): React$Node {
    return (
      <React.Fragment>
        <h5 className="text-center">OR</h5>
        {this._renderSocialLogins()}
      </React.Fragment>
    );
  }
  
  _renderSocialLogins(): React$Node {
    return (
      <div>
        {this.state.visibleApps.map(app => {
          const config: SocialSignInLinkDisplayConfig = socialSignInLinkDisplayConfigMap[app];
          const iconClass: string = "LogInController-socialIcon" + (config.iconClass ? " " + config.iconClass : "");
          return (
          <div className="LogInController-socialLink">
            <a href={"/login/" + app} key={app}>
              <span style={{color: config.iconColor}} className={iconClass}>
                {config.iconElement}
              </span>
              <span>
                Continue with {config.displayName}
              </span>
            </a>
          </div>
        );
        })}
      </div>
    );
  }
}

export default SocialMediaSignupSection;
