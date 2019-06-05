// @flow

import React from 'react';
import {Container} from 'flux/utils';
import url from "../utils/url.js";
import Section from "../enums/Section.js";
import Sponsors, {SponsorMetadata} from "../utils/Sponsors.js";
import NavigationStore from "../stores/NavigationStore.js";
import _ from 'lodash';

const sectionsToShowFooter: $ReadOnlyArray<string> = [
  Section.FindProjects,
  Section.AboutProject,
  Section.AboutUs,
  Section.Press
];

class MainFooter extends React.Component<{||}> {

  constructor(): void {
    super();
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
    return this.state.section && (_.includes(sectionsToShowFooter, this.state.section)) && (
      <React.Fragment>
      <div className="MainFooter-border"></div>
      <div className="MainFooter-footer container">
        <div className="MainFooter-item col-xs-12 col-md-6">
          <h2>Sponsors Make It Possible</h2>
          <p>Support the acceleration of social change</p>
          <a className="EmailVerified-find-projects-btn btn btn-theme" href={url.section(Section.PartnerWithUs)}>
            PARTNER WITH US
          </a>
        </div>
        {this._renderSponsors()}
      </div>
    </React.Fragment>
    );
  }

  _renderSponsors(): ?Array<React$Node>  {
    const sponsors: $ReadOnlyArray<SponsorMetadata> = Sponsors.list();
    if(sponsors) {
      return sponsors.map( (sponsor: SponsorMetadata, i:number) => {
        return (
          <div key={i} className="MainFooter-sponsor MainFooter-item col-xs-12 col-md-6">
            <div>
              <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="MainFooter-sponsor-link">
                <img src={sponsor.thumbnailUrl}/>
              </a>
            </div>
          </div>
        );
      });
    }
  }
}
export default Container.create(MainFooter);
