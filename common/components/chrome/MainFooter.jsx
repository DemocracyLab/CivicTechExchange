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
  Section.Press,
  Section.Landing
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
        <div className="MainFooter-item col-12 text-center">
          <h2>Sponsors Make It Possible</h2>
          <p>Support the acceleration of social change</p>
          <a className="btn btn-primary" href={url.section(Section.PartnerWithUs)}>
            PARTNER WITH US
          </a>
        </div>
        <div className="MainFooter-sponsor-container col-12">
            {this._renderSponsors("Visionary")}
            {this._renderSponsors("Sustaining")}
            {this._renderSponsors("Advancing")}
            {this._renderSponsors("Supporting")}
        </div>
      </div>
      </React.Fragment>
    );
  }

  _renderSponsors(category): ?Array<React$Node>  {
    const sponsors: $ReadOnlyArray<SponsorMetadata> = Sponsors.list();
    let sdata = sponsors.filter(obj => obj.category === category)
    if(!_.isEmpty(sdata)) {
      return (
        <React.Fragment>
          <h3 className="MainFooter-sponsor-header text-center side-lines">{category}</h3>
          <div className="MainFooter-sponsor-wrapper">
            {sdata.map( (sponsor: SponsorMetadata, i:number) => {
              return (
                <div key={i} className="MainFooter-sponsor">
                  <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="MainFooter-sponsor-link">
                    <img src={sponsor.thumbnailUrl}/>
                  </a>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      )
    }
  }
}
export default Container.create(MainFooter);
