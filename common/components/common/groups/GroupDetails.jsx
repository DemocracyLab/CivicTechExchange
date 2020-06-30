// @flow
import React from 'react';
import GlyphStyles, { GlyphSizes, Glyph } from '../../utils/glyphs.js'
import urlHelper from '../../utils/url.js'

type Props = {|
    groupLocation: string,
    groupUrl: string
|};

class GroupDetails extends React.PureComponent<Props> {
    constructor(props: Props): void {
        super(props);
    }

    render(): $React$Node {
      return(
          <React.Fragment>
              {this.props.groupLocation &&
              <div className="AboutProjects-icon-row">
                  <i className={Glyph(GlyphStyles.MapMarker, GlyphSizes.LG)} />
                  <p className="AboutProjects-icon-text">{this.props.groupLocation}</p>
              </div>
              }
              {this.props.groupUrl &&
                  <div className="AboutProjects-icon-row">
                    <i className={Glyph(GlyphStyles.Globe, GlyphSizes.LG)} />
                    <p className="AboutProjects-url-text"><a href={this.props.groupUrl} target="_blank" rel="noopener noreferrer">{urlHelper.beautify(this.props.groupUrl)}</a></p>
                  </div>
              }
          </React.Fragment>
      )
    }
}
export default GroupDetails;
