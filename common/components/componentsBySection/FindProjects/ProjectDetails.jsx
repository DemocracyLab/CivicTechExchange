// @flow
import React from 'react';
import Divider from '@material-ui/core/Divider';
import {Earth, MapMarker, Clock, Domain, ChartBar, Key} from 'mdi-material-ui';
import Moment from 'react-moment';

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
              <div className="AboutProjects-icon-row">
                  <MapMarker/>
                  <p className="AboutProjects-icon-text">{this.state.projectLocation}</p>
                </div>
                <div className="AboutProjects-icon-row">
                  <Earth/>
                  <p className="AboutProjects-icon-text">{this.state.projectUrl}</p>
                </div>
                <div className="AboutProjects-icon-row">
                  <Clock/>
                  <p className="AboutProjects-icon-text"><Moment fromNow>{this.state.dateModified}</Moment></p>
                </div>
                <div className="AboutProjects-icon-row">
                  <ChartBar/>
                  <p className="AboutProjects-icon-text">{this.state.projectStage}</p>
                </div>
          </React.Fragment>
      )
    }
}
export default ProjectDetails;
