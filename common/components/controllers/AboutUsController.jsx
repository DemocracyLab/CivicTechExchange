// @flow

import React from "react";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";
import type { TeamAPIData } from "../utils/ProjectAPIUtils.js";
import cdn, { Images } from "../utils/cdn.js";
import SplashScreen, {
  HeroImage,
} from "../componentsBySection/FindProjects/SplashScreen.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import TeamSections from "../componentsBySection/AboutUs/TeamSections.jsx";
import { Glyph, GlyphStyles, GlyphSizes, GlyphWidth } from "../utils/glyphs.js";
import Button from "react-bootstrap/Button";

type State = {|
  teamResponse: TeamAPIData,
  projectId: number,
|};

class AboutUsController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      projectId: parseInt(window.DLAB_PROJECT_ID),
    };
  }
  //componentDidMount and loadProjectDetails copied from AboutProjectController, since we're retrieving a project's information the same way
  //in this case we use the value provided as an env key to get DemocracyLab's project info, to use in the Our Team section

  componentDidMount() {
    ProjectAPIUtils.fetchTeamDetails((teamResponse: TeamAPIData) =>
      this.setState({ teamResponse: teamResponse })
    );
  }

  _ourMission() {
    const header: string = "Mission";
    const text: string =
      "Empower people who use technology to advance the public good.";
    return (
      <SplashScreen
        className="about-us-mission about-us-content"
        header={header}
        text={text}
        img={HeroImage.AboutMission}
      ></SplashScreen>
    );
  }
  _ourVision() {
    const header: string = "Vision";
    const text: string =
      "Technology enables our collective intelligence to solve the most challenging social, economic, environmental and civic problems while empowering all members of our societies.";
    const opacity: number = 0;
    return (
      <SplashScreen
        className="about-us-vision about-us-content"
        header={header}
        text={text}
        img={"OurVisionBGoverlay.jpg"}
        opacity={opacity}
        doNotFillViewport
      ></SplashScreen>
    );
  }

  _ourValues() {
    return (
      <div className="row about-us-values">
        <div className="col-12 col-md-6 about-us-values-core">
          <h2>Core Values</h2>
          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("CommunityIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Community Built</h3>
              <p>We are building for the community, by the community.</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("InclusivityIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Inclusivity</h3>
              <p>
                We believe everyone has something to contribute to the solutions
                society needs.
              </p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("CollaborationIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Collaboration</h3>
              <p>
                Diverse teams working together with goodwill and respect can
                accomplish great things.
              </p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("EncourageTransparencyIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Transparency</h3>
              <p>Openness promotes learning and builds trust.</p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("InnovateIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Innovation</h3>
              <p>
                We encourage experimentation and shared learning to accelerate
                innovation.
              </p>
            </div>
          </div>

          <div className="about-us-values-list">
            <div className="about-us-values-icon">
              <img src={cdn.image("ChallengeIcon.png")}></img>
            </div>
            <div className="about-us-values-text">
              <h3>Challenge</h3>
              <p>
                We believe the hard questions are the best questions, and we
                welcome the challenge to better ourselves and our products.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 about-us-values-image">
          <img src={cdn.image(Images.CORE_VALUES_BG)}></img>
        </div>
      </div>
    );
  }
  _problemSolution() {
    return (
      <div className="row about-us-ps">
        <hr />
        <div className="d-none d-md-block col-12 col-md-6 about-us-ps-image">
          <img src={cdn.image(Images.PROBLEM_SOLUTION_BG)}></img>
        </div>
        <div className="col-12 col-md-6">
          <div className="about-us-ps-problem">
            <h2>Problem</h2>
            <p>
              Too few tech-for-good projects launch, scale, and achieve impact
              in the world.
            </p>
          </div>
          <div className="d-md-none col-12 col-md-6 about-us-ps-image">
            <img src={cdn.image(Images.PROBLEM_SOLUTION_BG)}></img>
          </div>
          <div className="about-us-ps-solution">
            <h2>Solution</h2>
            <p>
              DemocracyLab helps tech for good projects launch by connecting
              skilled volunteers to projects that need them. We are open to
              projects from individuals, community organizations, non-profits,
              social purpose companies and government agencies. Our platform
              helps volunteers give back and develop new skills, while
              accelerating the evolution of new technologies that empower
              citizens and help institutions become more accessible,
              accountable, and efficient.
            </p>
          </div>
        </div>
      </div>
    );
  }

  _volunteerWithUs() {
    return (
      <div className="about-us-volunteer col">
        <div className="row">
          <div className="col-sm-3">
            <img
              className="about-us-volunteer-logo"
              src={cdn.image(Images.DL_GLYPH)}
            ></img>
          </div>
          <div className="col-xs-12 col-sm-9">
            <h2>Volunteer</h2>
            <p>
              We connect skilled volunteers with the projects that need them.
              Open to everyone from individuals and established nonprofits to
              government organizations and for-profit social enterprises — we
              provide an open avenue for a better connection, more efficient
              collaboration, and increased impact.
            </p>
            <p className="about-us-volunteer-disclaimer">
              DemocracyLab is a volunteer-based 501(c)3 non-profit organization,
              headquartered in Seattle, WA.
            </p>
            <div className="about-us-volunteer-buttons">
              <Button
                href={url.section(Section.AboutProject, {
                  id: this.state.projectId,
                })}
                variant="outline-primary"
              >
                Join Us
              </Button>
              <Button
                href={url.section(Section.Donate)}
                variant="outline-secondary"
              >
                Donate
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _annualReport(): $React$Node {
    return (
      <div className="about-us-annualreport row">
        <div className="col about-us-annualreport-container">
          <div className="about-us-annualreport-left">
            <i className={Glyph(GlyphStyles.PDF, GlyphSizes.X5)}></i>
          </div>
          <div className="about-us-annualreport-right">
            <h3>Annual Report</h3>
            <p>
              Please review our{" "}
              <a href="https://d1agxr2dqkgkuy.cloudfront.net/documents/2023%20Annual%20Report.pdf">
                2023 Annual Report
              </a>{" "}
              to learn about the impact of our programs and platform last year.
            </p>
          </div>
        </div>
      </div>
    );
  }

  render(): $React$Node {
    return (
      <React.Fragment>
        <div className="container-fluid pl-0 pr-0 about-us-root">
          {this._ourMission()}
          {this._ourVision()}
        </div>
        <div className="container about-us-root">
          {this._ourValues()}
          {this._problemSolution()}
          {this._annualReport()}
          <TeamSections teamResponse={this.state.teamResponse} />
          {this._volunteerWithUs()}
        </div>
      </React.Fragment>
    );
  }
}

export default AboutUsController;
