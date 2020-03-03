// @flow

import React from 'react';
import type {Project} from '../../stores/ProjectSearchStore.js';
import {List} from 'immutable'
import ProjectCard from "../FindProjects/ProjectCard.jsx";
import {Glyph, GlyphSizes, GlyphStyles} from "../../utils/glyphs.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from '../../enums/Section.js';
import _ from 'lodash';


type State = {|
  projects: List<Project>,
  showFirstSection: boolean,
  windowHeight: number,
  windowWidth: number,
  cardStart: number,
  cardEnd: number
|};

class RecentProjectsSection extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      projects: null,
      showFirstSection: true, // if false, implicitly derive that second section should show
      windowHeight: 0,
      windowWidth: 0,
      cardStart: 0,
      cardEnd: 3
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }


  componentDidMount() {
    const url: string = "/api/projects/recent/?count=6";
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse => this.setState({
        projects: getProjectsResponse.projects.map(ProjectAPIUtils.projectFromAPIData)
      })
    );
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount(): React$Node {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions(): React$Node {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    this._selectCards(window.innerWidth)
  }

  render(): React$Node {
    return (
      <div className="RecentProjects">
        <h2 className="RecentProjects-title">Active Projects</h2>
        <div className="RecentProjects-cards">
          {this._renderCards()}
        </div>
        <div className="RecentProjects-button">
          <Button className="RecentProjects-all" href={url.section(Section.FindProjects)}>See All Projects</Button>
        </div>
      </div>
    );
  }

  _selectCards(width): $React$Node {
    if (width < 992 && width >= 768) {
      this.setState({cardStart: 0, cardEnd: 4})
    } else if (width >= 992 && !this.state.showFirstSection) {
      this.setState({cardStart: 4, cardEnd: 6})
    } else {
      this.setState({cardStart: 0, cardEnd: 3})
    }
  }

  _renderCards(): $ReadOnlyArray<React$Node> {
    return !this.state.projects
      ? <i className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.X2)}></i>
      : this.state.projects.slice(this.state.cardStart, this.state.cardEnd).map(
          (project, index) =>
            <ProjectCard
              className="RecentProjects-card"
              project={project}
              key={index}
              textlen={140}
              skillslen={4}
            />
        );
  }
}


export default RecentProjectsSection;
