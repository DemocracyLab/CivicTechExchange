// @flow

import React from 'react';
import type {Project} from '../../stores/ProjectSearchStore.js';
import {List} from 'immutable'
import ProjectCard from "../FindProjects/ProjectCard.jsx";
import {Glyph, GlyphSizes, GlyphStyles} from "../../utils/glyphs.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";

type State = {|
  projects: List<Project>
|};

class RecentProjectsSection extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {projects: null};
  }
  
  componentDidMount() {
    const url: string = "/api/projects/recent/?count=3";
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse => this.setState({
        projects: getProjectsResponse.projects.map(ProjectAPIUtils.projectFromAPIData)
      }));
  }

  render(): React$Node {
    return (
      <div className="RecentProjects">
        {this._renderCards()}
      </div>
    );
  }

  _renderCards(): $ReadOnlyArray<React$Node> {
    return !this.state.projects
      ? <i className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.X2)}></i>
      : this.state.projects.map(
          (project, index) =>
            <ProjectCard
              project={project}
              key={index}
              textlen={140}
              skillslen={4}
            />
        );
  }
}


export default RecentProjectsSection;