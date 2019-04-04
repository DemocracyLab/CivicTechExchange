// @flow

import React from 'react';
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import Sponsors, {SponsorMetadata} from "../utils/Sponsors.js";

class MainFooter extends React.PureComponent<{||}> {

  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="MainFooter-footer container">
        <div className="MainFooter-item col-xs-12 col-md-6">
          <h2>Sponsors Make It Possible</h2>
          <p>Support the acceleration of social change</p>
          <a className="EmailVerified-find-projects-btn btn btn-default" href={url.section(Section.PartnerWithUs)}>
            PARTNER WITH US
          </a>
        </div>
        {this._renderSponsors()}
      </div>
    );
  }

  _renderSponsors(): ?Array<React$Node>  {
    const sponsors: $ReadOnlyArray<SponsorMetadata> = Sponsors.list();
    if(sponsors) {
      return sponsors.map( (sponsor: SponsorMetadata, i:number) => {
        return (
          <div key={i} className="MainFooter-sponsor MainFooter-item col-xs-12 col-md-6">
            <div>
              <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                <img src={sponsor.thumbnailUrl}/>
              </a>
            </div>
          </div>
        );
      });
    }
  }
}
export default MainFooter;
