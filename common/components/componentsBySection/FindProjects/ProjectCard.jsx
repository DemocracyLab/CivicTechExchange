// @flow

import cx from '../../utils/cx';
import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';
import Section from '../../../components/enums/Section.js';
import url from '../../utils/url.js';

type Props = {|
  +project: Project,
|};

const styles = {
  textDecoration: 'none'
}

class ProjectCard extends React.PureComponent<Props> {

  _cx: cx;

  constructor(): void {
    super();
    this._cx = new cx('ProjectCard-');
  }

  render(): React$Node {
    return (
      <a style={styles}
        className="ProjectCard-root"
        href={url.section(Section.AboutProject, {id: this.props.project.id})}>
        <img className="checkbox" src= "https://i.imgur.com/yXgKEHY.jpg"align="right"/>
        {this._renderName()}

        {this._renderIssueAndLocation()}
        <div className={this._cx.get('description', 'subtext', 'value')}>
          {this._renderDescription()}
        </div>
      </a>
    );
  }

  _renderName(): React$Node {
    return (
      <div>
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
        {this._renderLabelAndValue('Location: ', this.props.project.location)}
      </div>
    );
  }

  _renderLabelAndValue(label: string, value: string): React$Node {
      return (
        <div className="ProjectCard-subtext">
          <span className="ProjectCard-label">
            {label}
          </span>
          <span className="ProjectCard-value">
            {value}
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
