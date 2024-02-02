// @flow

import React from "react";
import { LinkInfo } from "../../forms/LinkInfo.jsx";
import {
  LinkSourceDisplayConfig,
  LinkDisplayConfigurationByUrl,
  DefaultLinkDisplayConfigurations,
} from "../../constants/LinkConstants.js";
import { Glyph, GlyphSizes } from "../../utils/glyphs.js";
import urlHelper from "../../utils/url.js";
import stringHelper from "../../utils/string.js";

const textLength: number = 20;

type Props = {|
  +link: LinkInfo,
|};

type State = {|
  siteDisplayConfig: ?LinkSourceDisplayConfig,
  linkTypeDisplayConfig: ?LinkSourceDisplayConfig,
  glyphStyle: ?string,
  topText: ?string,
  bottomText: ?string,
|};

class IconLinkDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = props.link ? this.initializeState(props) : {};
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.link) {
      this.setState(this.initializeState(nextProps));
    }
  }

  initializeState(props: Props): State {
    const siteDisplayConfig: LinkSourceDisplayConfig = this.getSiteDisplayConfig(
      props.link
    );
    const linkTypeDisplayConfig: LinkSourceDisplayConfig = this.getLinkTypeDisplayConfig(
      props.link
    );
    const glyphStyle: string = this.getGlyphStyle(
      siteDisplayConfig,
      linkTypeDisplayConfig
    );
    const topText: string = this.getTopText(
      props.link,
      siteDisplayConfig,
      linkTypeDisplayConfig
    );
    const bottomText: string = linkTypeDisplayConfig.sourceTypeDisplayName;

    return {
      siteDisplayConfig: siteDisplayConfig,
      linkTypeDisplayConfig: linkTypeDisplayConfig,
      glyphStyle: glyphStyle,
      topText: topText,
      bottomText: bottomText,
    };
  }

  render(): ?React$Node {
    if (this.state.linkTypeDisplayConfig) {
      return (
        <div className="IconLink-root">
          <a
            href={this.props.link.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="IconLink-left">
              <i
                className={Glyph(this.state.glyphStyle, GlyphSizes.X2)}
                aria-hidden="true"
              ></i>
            </div>
            <div className="IconLink-right">
              <p className="IconLink-topText" title={this.state.topText}>
                {this.state.topText}
              </p>
              <p className="IconLink-bottomText">{this.state.bottomText}</p>
            </div>
          </a>
        </div>
      );
    }
  }

  getSiteDisplayConfig(link: LinkInfo): ?LinkSourceDisplayConfig {
    const regexConfig: ?LinkSourceDisplayConfig = LinkDisplayConfigurationByUrl.find(
      (config: LinkSourceDisplayConfig) =>
        config.sourceUrlPattern.test(link.linkUrl)
    );

    return regexConfig;
  }

  getLinkTypeDisplayConfig(link: LinkInfo): LinkSourceDisplayConfig {
    return (
      DefaultLinkDisplayConfigurations[link.linkName] ||
      DefaultLinkDisplayConfigurations.other
    );
  }

  getGlyphStyle(
    siteDisplayConfig: ?LinkSourceDisplayConfig,
    linkTypeDisplayConfig: ?LinkSourceDisplayConfig
  ): string {
    return siteDisplayConfig
      ? siteDisplayConfig.iconClass
      : linkTypeDisplayConfig.iconClass;
  }

  getTopText(
    link: LinkInfo,
    siteDisplayConfig: ?LinkSourceDisplayConfig
  ): string {
    let topText: string;

    if (link.linkName in DefaultLinkDisplayConfigurations) {
      topText = siteDisplayConfig
        ? siteDisplayConfig.sourceDisplayName
        : urlHelper.beautify(link.linkUrl);
    } else {
      topText = link.linkName
        ? stringHelper.trimStartString(link.linkName, "social_")
        : urlHelper.beautify(link.linkUrl);
    }

    return topText;
  }
}

export default IconLinkDisplay;
