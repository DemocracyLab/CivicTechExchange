// @flow

import React from 'react';
import cdn,{Images} from "../utils/cdn.js";
import Sponsors, {SponsorMetadata} from "../utils/Sponsors.js";
import Headers from "../common/Headers.jsx";
import Section from "../enums/Section.js";
import url from '../../components/utils/url.js';
import prerender from "../utils/prerender.js";
import _ from "lodash";


class PartnerWithUsController extends React.Component<{||}> {
  constructor(): void {
    super();
  }

  componentDidMount() {
    prerender.ready();
  }

  render(): React$Node {
    return (
      <React.Fragment>
      <Headers
      title="Partnering With DemocracyLab"
      description="Partnering With DemocracyLab"
      />
      <div className="PartnerWithUsController-root container">
        <div className="PartnerWithUsController-topSection col-xs-12">
          <h1>Partner With Us</h1>
          <p>Support the acceleration of social change</p>
          <a className="btn btn-primary" href={url.section(Section.ContactUs)}>
            CONTACT US
          </a>
        </div>
        <div className="PartnerWithUsController-sponsorTypes row">
          {this._renderEventSponsorshipSection()}
          {this._renderPlatformSponsorshipSection()}
        </div>
        <div className="PartnerWithUsController-partners col-12">
          <h2>Our Partnerships</h2>
          {/* {this._renderSponsors("Visionary")} */}
          {this._renderSponsors("Sustaining")}
          {this._renderSponsors("Advancing")}
          {/* {this._renderSponsors("Supporting")} */}
        </div>

      </div>
      </React.Fragment>
    );
  }

  _renderEventSponsorshipSection(): React$Node {
    return (
      <div className="PartnerWithUsController-sponsorTypeSection col-xs-12 col-md-6">
        <div className="PartnerWithUsController-headerLogo">
          <img src={cdn.image(Images.EVENT_SPLASH)}/>
        </div>
        <h2>Event Sponsorship</h2>
        <p className="PartnerWithUsController-sponsorAmount">
          Starting at $500 per event
        </p>
        <p>
          DemocracyLab organizes hackathons every other month in partnership with other Seattle tech-for-good organizations.
          Sponsorships allow us to feed attendees breakfast and lunch, and pays for other incidental expenses.
        </p>
        <p>
          Sponsors are listed on all promotional materials, receive call-outs on social media, have time to introduce
          their company to the audience during the event, and an opportunity to staff a table at the events if desired.
        </p>
      </div>
    );
  }

  _renderPlatformSponsorshipSection(): React$Node {
    return (
      <div className="PartnerWithUsController-sponsorTypeSection col-xs-12 col-md-6">
        <div className="PartnerWithUsController-headerLogo">
          <img src={cdn.image(Images.PLATFORM_SPLASH)}/>
        </div>
        <h2>Platform Sponsorship</h2>
        <p className="PartnerWithUsController-sponsorAmount">
          Starting at $250 per month
        </p>
        <p>
          DemocracyLab's web platform now attracts nearly 1,000 users per month, most of whom are skilled technologists
          seeking opportunities to contribute their talents to projects that advance the public good.
        </p>
        <p>
          Your sponsorship allows us to cover overhead costs associated with running our platform and expenses related
          to marketing our work and growing our audience.
        </p>
        <p>
          Your company's linked logo will be included in the footer of all pages of our website, and a description of
          your company and its value proposition will be featured on our Sponsors page.  DemocracyLab thanks our sponsors
          on social media at least monthly.
        </p>
      </div>
    );
  }

  _renderSponsors(category): ?React$Node {
    const sponsors: $ReadOnlyArray<SponsorMetadata> = Sponsors.list();
    let sdata = sponsors.filter(obj => obj.category === category);
    if (!_.isEmpty(sdata)) {
      return (
        <React.Fragment>
          <h3 className="text-center side-lines">{category}</h3>
          <div className="PartnerWithUsController-sponsorList">
            {
              sdata.map( (sponsor: SponsorMetadata, i:number) => {
                return (
                  <div key={i} className="PartnerWithUsController-sponsor">
                    <div className="PartnerWithUsController-sponsor-logo">
                      <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                        <img src={sponsor.thumbnailUrl}/>
                      </a>
                    </div>
                    <div className="PartnerWithUsController-sponsor-text">
                      <h6>{sponsor.displayName}</h6>
                      <p>{sponsor.description}</p>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </React.Fragment>
      );
    }
  }
}

export default PartnerWithUsController;
