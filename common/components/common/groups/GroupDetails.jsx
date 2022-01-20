// @flow
import React from "react";
import GlyphStyles, { GlyphSizes, Glyph } from "../../utils/glyphs.js";
import urlHelper from "../../utils/url.js";
import utils from "../../utils/utils.js";

type Props = {|
  groupLocation: string,
  groupUrl: string,
  projectCount: ?number,
|};

class GroupDetails extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
  }

  render(): $React$Node {
    return (
      <React.Fragment>
        {this.props.groupLocation && (
          <div className="AboutProject-icon-row">
            <i className={Glyph(GlyphStyles.MapMarker, GlyphSizes.LG)} />
            <p className="AboutProject-icon-text">{this.props.groupLocation}</p>
          </div>
        )}
        {this.props.groupUrl && (
          <div className="AboutProject-icon-row">
            <i className={Glyph(GlyphStyles.Globe, GlyphSizes.LG)} />
            <p className="AboutProject-url-text">
              <a
                href={this.props.groupUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {urlHelper.beautify(this.props.groupUrl)}
              </a>
            </p>
          </div>
        )}
        {this.props.projectCount > 0 && (
          <div className="AboutProject-icon-row">
            <i className={Glyph(GlyphStyles.Calendar, GlyphSizes.LG)} />
            <p className="AboutProject-icon-text">
              {this.props.projectCount +
                " " +
                utils.pluralize("project", "projects", this.props.projectCount)}
            </p>
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default GroupDetails;
