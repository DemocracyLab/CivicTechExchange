// @flow

import React from 'react';
import {LinkInfo} from "../../forms/LinkInfo.jsx";
import {LinkSourceDisplayConfig, LinkDisplayConfigurationByUrl, DefaultLinkDisplayConfigurations, LinkNames} from "../../constants/LinkConstants.js";
import {Glyph, GlyphSizes} from "../../utils/glyphs.js";
import Truncate from "../../utils/truncate.js";
import urlHelper from "../../utils/url.js";

const textLength: number = 25;

type Props = {|
  +link: LinkInfo
|};

type State = {|
  siteDisplayConfig: ?LinkSourceDisplayConfig,
  linkTypeDisplayConfig: ?LinkSourceDisplayConfig,
  glyphStyle: ?string,
  topText: ?string,
  topTitle: ?string,
  bottomText: ?string,
|};

class IconLinkDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = props.link ? this.initializeState(props) : {};
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.link) {
      this.setState(this.initializeState(nextProps));
    }
  }
  
  initializeState(props: Props): State {
    const siteDisplayConfig: LinkSourceDisplayConfig = this.getSiteDisplayConfig(props.link);
    const linkTypeDisplayConfig: LinkSourceDisplayConfig = this.getLinkTypeDisplayConfig(props.link);
    const glyphStyle: string = this.getGlyphStyle(siteDisplayConfig, linkTypeDisplayConfig);
    const topText: string = this.getTopText(props.link, siteDisplayConfig, linkTypeDisplayConfig);
    const bottomText: string = linkTypeDisplayConfig.sourceTypeDisplayName;
  
    return {
      siteDisplayConfig: siteDisplayConfig,
      linkTypeDisplayConfig: linkTypeDisplayConfig,
      glyphStyle: glyphStyle,
      topText: Truncate.stringT(topText, textLength),
      topTitle: topText.length >= textLength ? topText : null,
      bottomText: bottomText
    };
  }
  
  render(): ?React$Node {
    if(this.state.linkTypeDisplayConfig) {
      return (
        <div className="IconLink-root">
          <a href={this.props.link.linkUrl}>
            <div className="IconLink-left">
              <i className={Glyph(this.state.glyphStyle, GlyphSizes.X2)} aria-hidden="true"></i>
            </div>
            <div className="IconLink-right">
              <p className="IconLink-topText" title={this.state.topTitle}>
                {this.state.topText}
              </p>
              <p className="IconLink-bottomText">
                {this.state.bottomText}
              </p>
            </div>
          </a>
        </div>
      );
    }
  }
  
  getSiteDisplayConfig(link: LinkInfo): ?LinkSourceDisplayConfig {
    const regexConfig: ?LinkSourceDisplayConfig = LinkDisplayConfigurationByUrl.find(
      (config:LinkSourceDisplayConfig) => config.sourceUrlPattern.test(link.linkUrl)
    );
  
    return regexConfig;
  }
  
  getLinkTypeDisplayConfig(link: LinkInfo): LinkSourceDisplayConfig {
    return DefaultLinkDisplayConfigurations[link.linkName] || DefaultLinkDisplayConfigurations.other;
  }
  
  getGlyphStyle(siteDisplayConfig: ?LinkSourceDisplayConfig, linkTypeDisplayConfig: ?LinkSourceDisplayConfig): string {
    return siteDisplayConfig ? siteDisplayConfig.iconClass : linkTypeDisplayConfig.iconClass;
  }
  
  getTopText(link: LinkInfo, siteDisplayConfig: ?LinkSourceDisplayConfig): string {
    let topText: string;
  
    if (link.linkName in LinkNames) {
      topText = siteDisplayConfig ? siteDisplayConfig.sourceDisplayName : LinkNames[link.linkName];
    } else {
      topText = link.linkName ? link.linkName : urlHelper.beautify(link.linkUrl);
    }
    
    return topText;
  }
}

export default IconLinkDisplay;
