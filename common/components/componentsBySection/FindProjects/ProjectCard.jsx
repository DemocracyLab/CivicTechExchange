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
          <a
            className=""
            href={url.section(Section.AboutProject, {id: this.props.project.id})}
            target="_blank" rel="noopener noreferrer">
            {
              this.props.project && this.props.project.claimed
              ? <img className="checkbox" src={cdn.image("verified_check.jpg")} align="right"/>
              : null
            }
            {this._renderName()}
            {this._renderIssueAndLocation()}
          </a>
        </div>
      </div>
    );
  }

  _renderName(): React$Node {
    return (
      <div className="borderbottom">
        <div className="ProjectCard-name" >
          <div>
            <img className="upload_img upload_img_bdr" src={this.props.project && this.props.project.thumbnail && this.props.project.thumbnail.publicUrl}/>
          </div>
            <h3>{this.props.project.name}</h3>
        </div>
      </div>
    );
  }

  _renderIssueAndLocation(): React$Node {
    return (
      <div className="ProjectCard-issueAndLocation">
        {
          this._renderLabelAndValue(
            'Issue Area: ',
            this.props.project.issueArea,
          )
        }
        {
          (this.props.project.location !== Locations.OTHER)
          ? this._renderLabelAndValue('Location: ', this.props.project.location)
          : this._renderLabelAndValue('Location: ', null)
        }
        {
          this._renderDateModified()
        }
      </div>
    );
  }

  _renderDateModified(): React$Node {
    return (
      <div className="ProjectCard-subtext">
        <span className="ProjectCard-label">
          Last Updated:&nbsp;
        </span>
        <span className="ProjectCard-value">
          <Moment format="MMM D, YYYY, h:mm a">{this.props.project.date_modified}</Moment>
        </span>
      </div>
    )
  }

  _renderLabelAndValue(label: string, value: string): React$Node {
      return (
        <div className="ProjectCard-subtext">
          <span className="ProjectCard-label">
            {label}
          </span>
          <span className="ProjectCard-value">
            {value ? value : null}
          </span>
        </div>
      );
  }

  _renderDescription(): string {
    const maxDescriptionLength = 300;
    return this.props.project.description.length > maxDescriptionLength
      ? this.props.project.description.slice(0, maxDescriptionLength) + '...'
      : this.props.project.description;
  }
}

export default ProjectCard;
