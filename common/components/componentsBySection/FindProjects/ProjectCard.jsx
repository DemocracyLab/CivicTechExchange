// @flow

import cx from '../../utils/cx';
import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';
import Section from '../../../components/enums/Section.js';
import url from '../../utils/url.js';
import {Locations} from "../../constants/ProjectConstants.js";
import cdn from "../../utils/cdn.js";
import Moment from 'react-moment';
import Truncate from "../../utils/truncate.js";

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
      <div className="col-12 col-lg-6">
        <div className="ProjectCard-root">
          <a href={url.section(Section.AboutProject, {id: this.props.project.id})}
            target="_blank" rel="noopener noreferrer">
            {this._renderSubInfo()}
            {this._renderProjectDescription()}
          </a>
        </div>
      </div>
    );
  }
  _renderProjectDescription(): React$Node {
    return (
      <div className="ProjectCard-info">
        <div className="ProjectCard-name">
            <h3>{this.props.project.name}</h3>
        </div>
        <div className="ProjectCard-issueArea">
            {this.props.project.issueArea}
        </div>
        <div className="ProjectCard-description">
          <p>{Truncate.stringT(this.props.project.description, 50)}</p>
        </div>
        <div className="ProjectCard-skills">
        <span className="ProjectCard-sectiontext">Skills Needed</span>
          {this._renderSkillList(4)}
        </div>
      </div>
    );
  }
  _renderSkillList(numskills): React$Node {
    //take array of skills needed from props, truncate if required, and map to list items
    const skills = Truncate.arrayT(this.props.project.positions, numskills)
    let index = 0; //super hacky unique key indexes goooo
    return (
      <ul>
        {skills.map((skills) =>
          <li key={index++}>{skills}</li>
        )}
      </ul>
    );
  }
  _renderSubInfo(): React$Node {
    return (
      <div className="ProjectCard-subinfo">
        <div className="ProjectCard-image">
          <img src={this.props.project && this.props.project.thumbnail ? this.props.project.thumbnail.publicUrl : '/static/images/projectlogo-default.png'}/>
        </div>
        <ul>
          <li>
            {this.props.project.location}
          </li>
          <li>
          {Truncate.urlPrefixT(this.props.project.url)}
          </li>
          <li>
            <Moment fromNow>{this.props.project.date_modified}</Moment>
          </li>
        </ul>
      </div>
    )
  }
}

export default ProjectCard;
