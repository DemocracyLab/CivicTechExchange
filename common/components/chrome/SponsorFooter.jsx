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
  Section.Home,
];

type Props = {|
  forceShow: boolean,
|};

class SponsorFooter extends React.Component<Props> {
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
      (_.includes(sectionsToShowFooter, this.state.section) ||
        this.props.forceShow == true) && (
        <React.Fragment>
          <div className="Footer-dividerline"></div>
          <div className="SponsorFooter-footer container">
            <div className="row">
              <div className="SponsorFooter-item SponsorFooter-partner-button SponsorFooter-mobile-divider col-12 text-center">
                <Button
                  variant="outline-secondary"
                  href={url.section(Section.Companies, {
                    tab: CorporatePageTabs.Sponsorship,
                  })}
                >
                  Become a Partner
                </Button>
              </div>

              <div className="SponsorFooter-item col-12 text-center SponsorFooter-mobile-divider">
                <h2>Our Corporate Partners</h2>
              </div>

              <div className="SponsorFooter-sponsor-container col-12 SponsorFooter-mobile-divider">
                {this._renderSponsors("Visionary", "visionary")}
                {this._renderSponsors("Sustaining", "sustaining")}
                {this._renderSponsors("Advancing", "advancing")}
                {this._renderSponsors("Supporting", "supporting")}
                {this._renderSponsors("In-kind Support", "in-kind")}
              </div>

              <div className="col-12 text-center SponsorFooter-past-support">
                <h3>Made Possible With Past Support From</h3>
                <img
                  src="https://d1agxr2dqkgkuy.cloudfront.net/img/bill-melinda-gates-foundation.png"
                  alt="Bill and Melinda Gates Foundation logo"
                ></img>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    );
  }

  _renderSponsors(category, cname) {
    const sponsors: $ReadOnlyArray<SponsorMetadata> = Sponsors.list();
    let sdata = sponsors.filter(obj => obj.category === category);
    let classes = `SponsorFooter-sponsor-wrapper SponsorFooter-category-${cname}`;
    if (!_.isEmpty(sdata)) {
      return (
        <React.Fragment>
          <h3 className="text-center">{category}</h3>
          <div className={classes}>
            {sdata.map((sponsor: SponsorMetadata, i: number) => {
              return (
                <div key={i} className="SponsorFooter-sponsor">
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="SponsorFooter-sponsor-link"
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
export default Container.create(SponsorFooter);
