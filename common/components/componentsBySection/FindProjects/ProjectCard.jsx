// @flow

import cx from '../../utils/cx';
import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';
import Section from '../../../components/enums/Section.js';
import url from '../../utils/url.js';
import Moment from 'react-moment';
import Truncate from "../../utils/truncate.js";
import urlHelper from "../../utils/url.js"
import GlyphStyles from "../../utils/glyphs.js";

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
            {this._renderLogo()}
            {this._renderSubInfo()}
            {this._renderTitleAndIssue()}
            {this._renderProjectDescription()}
            {this._renderSkillsNeeded()}
          </a>
        </div>
      </div>
    );
  }
  _renderLogo(): React$Node {
    return (
      <div className="ProjectCard-logo">
        <img src={this.props.project && this.props.project.thumbnail ? this.props.project.thumbnail.publicUrl : '/static/images/projectlogo-default.png'}/>
      </div>
    )
  }
  _renderTitleAndIssue(): React$Node {
    return (
      <div className="ProjectCard-title">
        <h2>{this.props.project.name}</h2>
        <h4>{this.props.project.issueArea}</h4>
      </div>
    )
  }
  _renderProjectDescription(): React$Node {
    return (
        <div className="ProjectCard-description">
          <p>{Truncate.stringT(this.props.project.description, this.props.textlen)}</p>
        </div>
    );
  }
  _renderSkillsNeeded(): React$Node {
    return (
    <div className="ProjectCard-skills">
    <h3>Skills Needed</h3>
      {this._generateSkillList(this.props.skillslen)}
    </div>
    )
  }
  _generateSkillList(numskills): React$Node {
    //take array of skills needed from props, truncate if required, and map to list items
    const skills = Truncate.arrayT(this.props.project.positions, numskills)
    return (
      <ul>
        {skills.map((skills, i) =>
          <li key={i}>{skills}</li>
        )}
      </ul>
    );
  }
  _renderSubInfo(): React$Node {
    //only renders a list item for ones where we have data, otherwise skip
    return (
      <div className="ProjectCard-subinfo">
        <ul>
        {this.props.project.location &&
          <li>
            <i className={GlyphStyles.MapMarker}></i>
            {this.props.project.location}
          </li>
        }
        {this.props.project.url &&
          <li>
            <i className={GlyphStyles.Globe}></i>
            {urlHelper.beautify(this.props.project.url)}
          </li>
        }
        {this.props.project.date_modified &&
          <li>
            <i className={GlyphStyles.Clock}></i>
            <Moment fromNow>{this.props.project.date_modified}</Moment>
          </li>
        }
        </ul>
      </div>
    )
  }
}

export default ProjectCard;
