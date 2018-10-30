// @flow

import cx from '../../utils/cx';
import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';
import Section from '../../../components/enums/Section.js';
import url from '../../utils/url.js';
import {Locations} from "../../constants/ProjectConstants.js";
import cdn from "../../utils/cdn.js";
import Moment from 'react-moment';

type Props = {|
  +project: Project,
|};

class ProjectCard extends React.PureComponent<Props> {

  _cx: cx;

  constructor(): void {
    super();
    this._cx = new cx('ProjectCard-');
  }

  render(): React$Node {
    return (
      <div className="col-12 col-md-6">
        <div className="ProjectCard-root">
          <a href={url.section(Section.AboutProject, {id: this.props.project.id})}
            target="_blank" rel="noopener noreferrer">
            {this._renderImage()}
            {this._renderSubInfo()}
            {this._renderProjectDescription()}
          </a>
        </div>
      </div>
    );
  }

  _renderImage(): React$Node {
    return (
      <div className="ProjectCard-image">
      <img className="upload_img upload_img_bdr" src={this.props.project && this.props.project.thumbnail && this.props.project.thumbnail.publicUrl}/>
      </div>
    );
  }

  _renderProjectDescription(): React$Node {
    return (
      <div className="ProjectCard-description">
        <div className="ProjectCard-name">
            <h3>{this.props.project.name}</h3>
        </div>
        <div className="ProjectCard-issueArea">
            {this.props.project.issueArea}
        </div>
          )
        }

      </div>
    );
  }
  _renderSubInfo(): React$Node {
    return (
      <div className="ProjectCard-subinfo">
      <ul>
        <li>
          {this.props.project.location}
        </li>
        <li>
          <Moment fromNow>{this.props.project.date_modified}</Moment>
        </li>
        <li>
          {this.props.project.project_url}
        </li>
      </ul>
    )
  }
}

export default ProjectCard;
