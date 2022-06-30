// @flow

import React from "react";
import type { Project } from "../../stores/ProjectSearchStore.js";
import { List } from "immutable";
import ProjectCard from "../FindProjects/ProjectCard.jsx";
import { Glyph, GlyphSizes, GlyphStyles } from "../../utils/glyphs.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import Carousel from "react-bootstrap/Carousel";

type State = {|
  projects: List<Project>,
  windowWidth: number,
  cardStart: number,
  cardCapacity: number,
|};

class RecentProjectsSection extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      projects: null,
      windowWidth: 0,
      cardStart: 0,
      cardCapacity: 3,
    };
    this._updateWindowDimensions = this._updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    const url: string = "/api/projects/recent/?count=6";
    fetch(new Request(url))
      .then(response => response.json())
      .then(getProjectsResponse =>
        this.setState({
          projects: getProjectsResponse.projects.map(
            ProjectAPIUtils.projectFromAPIData
          ),
        })
      );
    this._updateWindowDimensions();
    window.addEventListener("resize", this._updateWindowDimensions);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this._updateWindowDimensions);
  }

  _updateWindowDimensions(): void {
    this.setState({ windowWidth: window.innerWidth }, () =>
      this._setCardCapacity()
    );
  }

  render(): React$Node {
    return (
      <div className="RecentProjects">
        <h2 className="RecentProjects-title headline1">Active Projects</h2>
        <div className="RecentProjects-cards">{this._renderCards()}</div>
        <div className="RecentProjects-button">
          <Button
            className="RecentProjects-all"
            variant="secondary"
            href={url.section(Section.FindProjects)}
          >
            See All Projects
          </Button>
        </div>
      </div>
    );
  }

  _setCardCapacity(): void {
    //sets how many cards are shown at one time
    const width = this.state.windowWidth;
    if (width < 992 && width >= 768) {
      this.setState({ cardCapacity: 4, cardStart: 0 });
    } else {
      this.setState({ cardCapacity: 3 });
    }
  }

  _renderCards(): $ReadOnlyArray<React$Node> {
    if (!this.state.projects) {
      return (
        <i className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.X2)}></i>
      );
    }
    if (this.state.windowWidth < 992) {
      return this.state.projects
        .slice(
          this.state.cardStart,
          this.state.cardStart + this.state.cardCapacity
        )
        .map((project, index) => (
          <ProjectCard
            className="RecentProjects-card"
            project={project}
            key={index}
            textlen={140}
            skillslen={4}
          />
        ));
    } else {
      return (
        <Carousel
          className="RecentProjects-carousel w-100"
          indicators={false}
          interval={null}
          onSlid={(eventKey, direction) =>
            this._carouselSlidHandler(eventKey, direction)
          }
        >
          {this._renderCardsForCarousel()}
        </Carousel>
      );
    }
  }

  _carouselSlidHandler(eventKey, direction): void {
    const carouselChildren = document.querySelectorAll(
      ".RecentProjects-carousel"
    )[0].children;
    for (let el of carouselChildren) {
      if (el.className === "carousel-control-next") {
        eventKey === 1
          ? el.setAttribute("style", "display:none")
          : el.setAttribute("style", "display:flex");
      } else if (el.className === "carousel-control-prev") {
        eventKey === 0
          ? el.setAttribute("style", "display:none")
          : el.setAttribute("style", "display:flex");
      }
    }
  }

  _renderCardsForCarousel(): $ReadOnlyArray<ReactNode> {
    const carouselItem0 = (
      <Carousel.Item key="0">
        <div className="d-flex justify-content-center">
          {this.state.projects.slice(0, 3).map((project, index) => (
            <ProjectCard
              className="RecentProjects-card"
              project={project}
              key={index}
              textlen={140}
              skillslen={4}
            />
          ))}
        </div>
      </Carousel.Item>
    );
    const carouselItem1 = (
      <Carousel.Item key="1">
        <div className="d-flex justify-content-center">
          {this.state.projects.slice(3, 6).map((project, index) => (
            <ProjectCard
              className="RecentProjects-card"
              project={project}
              key={index}
              textlen={140}
              skillslen={4}
            />
          ))}
        </div>
      </Carousel.Item>
    );
    return [carouselItem0, carouselItem1];
  }
}

export default RecentProjectsSection;
