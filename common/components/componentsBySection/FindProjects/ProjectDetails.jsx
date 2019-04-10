// @flow
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Earth from 'mdi-material-ui/Earth';
import MapMarker from 'mdi-material-ui/MapMarker';
import Clock from 'mdi-material-ui/Clock';
import Domain from 'mdi-material-ui/Domain';
import ChartBar from 'mdi-material-ui/ChartBar';
import Key from 'mdi-material-ui/Key';
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
            dateModified: props.dateModified,
        }
    }

    render(): $React$Node {
      return(
          <React.Fragment>
          {this.state.projectLocation &&
              <div className="AboutProjects-icon-row">
                <MapMarker/>
                <p className="AboutProjects-icon-text">{this.state.projectLocation}</p>
              </div>
          }
          {this.state.projectUrl &&
              <div className="AboutProjects-icon-row">
                <Earth/>
                <p className="AboutProjects-icon-text"><a href={this.state.projectUrl} target="_blank" rel="noopener noreferrer">{urlHelper.beautify(this.state.projectUrl)}</a></p>
              </div>
          }
          {this.state.dateModified &&
              <div className="AboutProjects-icon-row">
                <Clock/>
                <p className="AboutProjects-icon-text"><Moment fromNow>{this.state.dateModified}</Moment></p>
              </div>
          }
          {this.state.projectStage &&
              <div className="AboutProjects-icon-row">
                <ChartBar/>
                <p className="AboutProjects-icon-text">{this.state.projectStage}</p>
              </div>
          }
          </React.Fragment>
      )
    }
}
export default ProjectDetails;
