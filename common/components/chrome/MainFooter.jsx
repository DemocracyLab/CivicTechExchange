// @flow

import React from "react";
import { Container } from "flux/utils";
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import Sponsors, { SponsorMetadata } from "../utils/Sponsors.js";
import NavigationStore from "../stores/NavigationStore.js";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import { CorporatePageTabs } from "../controllers/CorporateHackathonController.jsx";

const sectionsToShowFooter: $ReadOnlyArray<string> = [
  Section.FindProjects,
  Section.AboutProject,
  Section.AboutUs,
  Section.Press,
  Section.Home,
];

type Props = {|
  forceShow: boolean,
|};

class MainFooter extends React.Component<Props> {
  constructor(props: Props): void {
    super(props);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore];
  }

  static calculateState(prevState: State): State {
    return {
      section: NavigationStore.getSection(),
    };
  }

  render(): ?React$Node {
    return (
      this.state.section &&
      (_.includes(sectionsToShowFooter, this.state.section) || this.props.forceShow == true) && (
        <React.Fragment>
          <div className="MainFooter-border"></div>
          <div className="MainFooter-footer container">
            <div className="MainFooter-item col-12 text-center">
              <h2>Made Possible With Generous Support From</h2>
              <img
                src="https://d1agxr2dqkgkuy.cloudfront.net/img/bill-melinda-gates-foundation.png"
                alt="Bill and Melinda Gates Foundation logo"
              ></img>
            </div>
            <div className="MainFooter-item col-12 text-center">
              <h2>And Our Corporate Partners</h2>
              <Button
                variant="primary"
                href={url.section(Section.Companies, {
                  tab: CorporatePageTabs.Sponsorship,
                })}
                className="MainFooter-pws-button"
              >
                Partner With Us
              </Button>
            </div>
            <div className="MainFooter-sponsor-container col-12">
              {this._renderSponsors("Visionary")}
              {this._renderSponsors("Sustaining")}
              {this._renderSponsors("Advancing")}
              {this._renderSponsors("Supporting")}
              {this._renderSponsors("In-kind Support")}
            </div>
          </div>
        </React.Fragment>
      )
    );
  }

  _renderSponsors(category): ?Array<React$Node> {
    const sponsors: $ReadOnlyArray<SponsorMetadata> = Sponsors.list();
    let sdata = sponsors.filter(obj => obj.category === category);
    if (!_.isEmpty(sdata)) {
      return (
        <React.Fragment>
          <h2 className="MainFooter-sponsor-header text-center side-lines">
            {category}
          </h2>
          <div className="MainFooter-sponsor-wrapper">
            {sdata.map((sponsor: SponsorMetadata, i: number) => {
              return (
                <div key={i} className="MainFooter-sponsor">
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="MainFooter-sponsor-link"
                  >
                    <img src={sponsor.thumbnailUrl} />
                  </a>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      );
    }
  }
}
export default Container.create(MainFooter);
