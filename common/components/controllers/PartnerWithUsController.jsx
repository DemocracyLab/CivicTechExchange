// @flow

import React from 'react';
import cdn,{Images} from "../utils/cdn.js";
import Sponsors, {SponsorMetadata} from "../utils/Sponsors.js";

class PartnerWithUsController extends React.Component<{||}> {
  constructor(): void {
    super();
  }
  
  render(): React$Node {
    return (
      <div className="PartnerWithUsController-root">
        <div className="PartnerWithUsController-topSection">
          <h1>Partner With Us</h1>
          <p>Support the acceleration of social change</p>
          <a className="EmailVerified-find-projects-btn btn btn-default" href="mailto:hello@democracylab.org">
            CONTACT US
          </a>
        </div>
        <div className="PartnerWithUsController-sponsorTypes">
          {this._renderEventSponsorshipSection()}
          {this._renderPlatformSponsorshipSection()}
        </div>
        {this._renderSponsors()}
      </div>
    );
  }
  
  _renderEventSponsorshipSection(): React$Node {
    return (
      <div className="PartnerWithUsController-sponsorTypeSection">
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
      <div className="PartnerWithUsController-sponsorTypeSection">
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
          Your sponsorship allows us to cover overhead costs associated with running out platform and expenses related
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
  
  _renderSponsors(): ?React$Node {
    const sponsors: $ReadOnlyArray<SponsorMetadata> = Sponsors.list();
    if(sponsors) {
      return (
        <div className="PartnerWithUsController-partners">
          <h2>Our Partnerships</h2>
          <div className="PartnerWithUsController-sponsorList">
            {
              sponsors.map( (sponsor: SponsorMetadata, i:number) => {
                return (
                  <div key={i} className="PartnerWithUsController-sponsor">
                    <div>
                      <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                        <img src={sponsor.thumbnailUrl}/>
                      </a>
                    </div>
                    <div>
                      <h6>{sponsor.displayName}</h6>
                      <p>{sponsor.description}</p>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    }
  }
}

export default PartnerWithUsController;
