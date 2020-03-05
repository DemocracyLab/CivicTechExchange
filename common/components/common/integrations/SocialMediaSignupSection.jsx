// @flow

import React from 'react';
import svg, {SVGPath} from "../../utils/svg";
import CurrentUser from "../../utils/CurrentUser.js";
import _ from "lodash";

const socialAppVisibility: { [key: string]: boolean } = !_.isEmpty(window.SOCIAL_APPS_VISIBILITY) ? JSON.parse(_.unescape(window.SOCIAL_APPS_VISIBILITY)) : {};

const svgMap: { [key: string]: string } = {
  "linkedin": "LINKEDIN",
  "google": "GOOGLE",
  "github": "GITHUB",
  "facebook": "FACEBOOK"
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
      <div className="text-center">
        <h5>OR</h5>
        {this._renderSocialLogins()}
      </div>
    );
  }
  
  _renderSocialLogins(): React$Node {
    return (
      <div>
        {this.state.visibleApps.map(app => {return (
          <div className="LogInController-socialLink">
            <a href={"/login/" + app} key={app}>
              <span>
                {svg.path(SVGPath[svgMap[app]], "LogInController-socialIcon")}
              </span>
              <span>
                Continue with {app}
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
