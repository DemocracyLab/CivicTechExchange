// @flow

import _ from 'lodash';

export type SponsorMetadata = {|
  displayName: string,
  url: string,
  thumbnailUrl: string,
  description: string
|};

class Sponsors {
  static list(): $ReadOnlyArray<SponsorMetadata> {
    try {
      const sponsorMetadata:string = window.SPONSORS_METADATA;
      if(!_.isEmpty(sponsorMetadata)) {
        return JSON.parse(_.unescape(sponsorMetadata));
      }
    } catch(ex) {
      console.error("Failed to parse sponsor metadata. ", ex);
      return [];
    }
  }
}

export default Sponsors;
