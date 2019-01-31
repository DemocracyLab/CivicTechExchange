// @flow

import React from 'react';
import {LinkInfo} from "../../forms/LinkInfo.jsx";
import {LinkSourceDisplayConfig, LinkDisplayConfigurationByUrl, DefaultLinkDisplayConfigurations} from "../../constants/LinkConstants.js";

type Props = {|
  +link: LinkInfo
|};

type State = {|
  displayConfig: ?LinkSourceDisplayConfig
|};

class IconLinkDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      displayConfig: props.link && this.getLinkDisplayConfig(props.link)
    };
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.link) {
      this.setState({
        displayConfig: this.getLinkDisplayConfig(nextProps.link)
      });
    }
  }
  
  render(): ?React$Node {
    
    if(this.state.displayConfig) {
      return (
        <div className="IconLink-root">
          <a href={this.props.link.linkUrl}>
            <i className={this.state.displayConfig.iconClass} aria-hidden="true"></i>
            <p className="IconLink-topText">
              {this.state.displayConfig.sourceDisplayName || this.props.link.linkName}
            </p>
            <p className="IconLink-bottomText">
              {this.state.displayConfig.sourceTypeDisplayName}
            </p>
          </a>
        </div>
      );
    }
  }
  
  getLinkDisplayConfig(link: LinkInfo): LinkSourceDisplayConfig {
    //Check regexes for any specific website match
    const regexConfig: ?LinkSourceDisplayConfig = LinkDisplayConfigurationByUrl.find(
      (config:LinkSourceDisplayConfig) => config.sourceUrlPattern.test(link.linkUrl)
    );
    
    if(regexConfig) {
      return regexConfig;
    } else {
      //Then check for default configuration by link type
      return DefaultLinkDisplayConfigurations[link.linkName] || DefaultLinkDisplayConfigurations.other;
    }
  }
}

export default IconLinkDisplay;
