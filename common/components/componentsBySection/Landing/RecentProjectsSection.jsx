import React, {useState, useEffect} from "react";
import ProjectCard from "../FindProjects/ProjectCard.jsx";
import { Glyph, GlyphSizes, GlyphStyles } from "../../utils/glyphs.js";
import ProjectAPIUtils, { ProjectData } from "../../utils/ProjectAPIUtils.js";
import Button from "react-bootstrap/Button";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import Carousel from "react-bootstrap/Carousel";

export default function RecentProjectsSection() {
  const [projects, setProjects] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [cardCapacity, setCardCapacity] = useState(3);
  const [cardStart, setCardStart] = useState(0);

  useEffect(() => {
    const url = "/api/projects/recent/?count=6";
    fetch(new Request(url))
      .then(response => response.json())
      .then(response =>
        setProjects(
          response.projects.map(ProjectAPIUtils.projectFromAPIData)
        )
      );
  }, []);

  const updateWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
    updateCardCapacity();
  };

  const updateCardCapacity = () => {
    //sets how many cards are shown at one time
    const capacity = (windowWidth < 992 && windowWidth >= 768) ? 4 : 3;
    setCardCapacity(capacity);
  };

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    // cleanup event listener
    // 
    // return () => window.removeEventListener("resize", updateWindowDimensions);
  });


  const _renderCards = () => {
    if (!projects) {
      return (
        <i className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.X2)}></i>
      );
    }
    if (windowWidth < 992) {
      return projects
        .slice(
          cardStart,
          cardStart + cardCapacity
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
            _carouselSlidHandler(eventKey, direction)
          }
        >
          {_renderCardsForCarousel()}
        </Carousel>
      );
    }
  };

  const _carouselSlidHandler = (eventKey, direction) => {
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
  };

  const _renderCardsForCarousel = () => {
    const carouselItem0 = (
      <Carousel.Item key="0">
        <div className="d-flex justify-content-center">
          {projects.slice(0, 3).map((project, index) => (
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
          {projects.slice(3, 6).map((project, index) => (
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
  };

  return (
    <div className="RecentProjects">
      <h2 className="RecentProjects-title">Active Projects</h2>
      <div className="RecentProjects-cards">{_renderCards()}</div>
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
