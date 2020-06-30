// @flow
import React from 'react';
import GlyphStyles, { GlyphSizes, Glyph } from '../../utils/glyphs.js'
import urlHelper from '../../utils/url.js'

type Props = {|
    groupUrl: string,
|}

class GroupDetails extends React.PureComponent<Props, State> {
    constructor(props: Props): void {
        super(props);
        this.state = {
            groupUrl: props.groupUrl
        }
    }

    render(): $React$Node {
      return(
          <React.Fragment>
              {this.state.groupUrl &&
                  <div className="AboutProjects-icon-row">
                    <i className={Glyph(GlyphStyles.Globe, GlyphSizes.LG)} />
                    <p className="AboutProjects-url-text"><a href={this.state.groupUrl} target="_blank" rel="noopener noreferrer">{urlHelper.beautify(this.state.groupUrl)}</a></p>
                  </div>
              }
          </React.Fragment>
      )
    }
}
export default GroupDetails;
