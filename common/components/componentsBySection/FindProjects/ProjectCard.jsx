// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';
import Section from '../../../components/enums/Section.js';
import url from '../../utils/url.js';

type Props = {|
  +project: Project,
|};

class ProjectCard extends React.PureComponent<Props> {

  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="ProjectCard-root">
        <a className="ProjectCard-link" href={url.section(Section.AboutProject, {id: this.props.project.id})}>
          <img className="ProjectCard-img" src="http://www.placepuppy.net/420/300" alt="Card image" />
          <div className="ProjectCard-description">
            <h2><b>{this.props.project.name}</b></h2>
            <p style={{fontFamily: "sans-serif"}}>Some short description will be there, 
               there be will description short some.
            </p>
            <h3 className="h-color"><b>Location: </b>{this.props.project.location}</h3>
            <h3 className="h-color"><b>Issue Area: </b>{this.props.project.issueArea}</h3>
          </div>
        </a>
      </div>
    );
  }
}


export default ProjectCard;
