// @flow
import React from 'react';
import GlyphStyles, { GlyphSizes, Glyph } from '../../utils/glyphs.js'
import Moment from 'react-moment';
import urlHelper from '../../utils/url.js'

type Props = {|
    projectLocation: string,
    projectUrl: string,
    projectStage: string,
    dateModified: string,
|}

class ProjectDetails extends React.PureComponent<Props, State> {
    constructor(props: Props): void {
        super(props);
        this.state = {
            projectLocation: props.projectLocation,
            projectUrl: props.projectUrl,
            projectStage: props.projectStage,
            projectOrganizationType: props.projectOrganizationType,
            dateModified: props.dateModified,
        }
    }

    render(): $React$Node {
      return(
          <React.Fragment>
          {this.state.projectLocation &&
              <div className="AboutProjects-icon-row">
                <i className={Glyph(GlyphStyles.MapMarker, GlyphSizes.LG)} />
                <p className="AboutProjects-icon-text">{this.state.projectLocation}</p>
              </div>
          }
          {this.state.projectUrl &&
              <div className="AboutProjects-icon-row">
                <i className={Glyph(GlyphStyles.Globe, GlyphSizes.LG)} />
                <p className="AboutProjects-url-text"><a href={this.state.projectUrl} target="_blank" rel="noopener noreferrer">{urlHelper.beautify(this.state.projectUrl)}</a></p>
              </div>
          }
          {this.state.dateModified &&
              <div className="AboutProjects-icon-row">
                <i className={Glyph(GlyphStyles.Clock, GlyphSizes.LG)} />
                <p className="AboutProjects-icon-text"><Moment fromNow>{this.state.dateModified}</Moment></p>
              </div>
          }
          {this.state.projectStage &&
              <div className="AboutProjects-icon-row">
                <i className={Glyph(GlyphStyles.ChartBar, GlyphSizes.LG)} />
                <p className="AboutProjects-icon-text">{this.state.projectStage}</p>
              </div>
          }
          {this.state.projectOrganizationType &&
              <div className="AboutProjects-icon-row">
                <i className={Glyph(GlyphStyles.University, GlyphSizes.LG)} />
                <p className="AboutProjects-icon-text">{this.state.projectOrganizationType}</p>
              </div>
          }
          </React.Fragment>
      )
    }
}
export default ProjectDetails;
