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


type State = {|
  projects: List<Project>,
  windowWidth: number,
  cardStart: number,
  cardCapacity: number
|};

class RecentProjectsSection extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      projects: null,
      windowWidth: 0,
      cardStart: 0,
      cardCapacity: 3
    };
    this._updateWindowDimensions = this._updateWindowDimensions.bind(this);
    this._prevProjects = this._prevProjects.bind(this);
    this._nextProjects = this._nextProjects.bind(this);
  }


  componentDidMount() {
    const url: string = "/api/projects/recent/?count=6";
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse => this.setState({
        projects: getProjectsResponse.projects.map(ProjectAPIUtils.projectFromAPIData)
      })
    );
    this._updateWindowDimensions();
    window.addEventListener('resize', this._updateWindowDimensions);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this._updateWindowDimensions);
  }

  _updateWindowDimensions(): void {
    this.setState({ windowWidth: window.innerWidth }, () => this._setCardCapacity());
  }

  render(): React$Node {
    return (
      <div className="RecentProjects">
        <h2 className="RecentProjects-title">Active Projects</h2>
        <div className="RecentProjects-cards">
          {this._renderPrevControl()}
          {this._renderCards()}
          {this._renderNextControl()}
        </div>
        <div className="RecentProjects-button">
          <Button className="RecentProjects-all" href={url.section(Section.FindProjects)}>See All Projects</Button>
        </div>
      </div>
    );
  }

  _renderPrevControl(): $React$Node {
    if (this.state.cardStart != 0) {
      return (
        <div className="RecentProjects-toggle RecentProjects-decrease" onClick={this._prevProjects}>
          <i className={GlyphStyles.ChevronLeft}></i>
        </div>
      )
    } else {
      return null;
    }
  }

  _renderNextControl(): $React$Node {
    if (this.state.cardStart === 0) {
      return (
        <div className="RecentProjects-toggle RecentProjects-increase" onClick={this._nextProjects}>
          <i className={GlyphStyles.ChevronRight}></i>
        </div>
      )
    } else {
      return null;
    }
  }

  _nextProjects(): void {
    this.setState(prevState => ({
      cardStart: prevState.cardStart + this.state.cardCapacity
    }));
  }

  _prevProjects(): void {
    this.setState(prevState => ({
      cardStart: prevState.cardStart - this.state.cardCapacity
    }));
  }

  _setCardCapacity(): void {
    //sets how many cards are shown at one time
    const width = this.state.windowWidth
    if (width < 992 && width >= 768) {
      this.setState({cardCapacity: 4})
    } else {
      this.setState({cardCapacity: 3})
    }
  }

  _renderCards(): $ReadOnlyArray<React$Node> {
    return !this.state.projects
      ? <i className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.X2)}></i>
      : this.state.projects.slice(this.state.cardStart, this.state.cardStart + this.state.cardCapacity).map(
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
