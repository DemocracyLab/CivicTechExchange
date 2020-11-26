// @flow

import React from 'react';

type State = {|
  blurbType: ?string
|};

class DonateBlurb extends React.Component<{||}, State> {
  constructor(): void {
    super();
    this.blurbs = {
      "GivingTuesday": this._givingTuesday
    };
    this.state = {
      blurbType: window.DONATE_PAGE_BLURB
    };
  }
  
  render(): React$Node {
    const showBlurb: boolean = this.state.blurbType in this.blurbs;
    return (
      <React.Fragment>
        {showBlurb && this.blurbs[this.state.blurbType]()}
      </React.Fragment>
    );
  }
  
  _givingTuesday(): React$Node {
    return (
      <React.Fragment>
        <h1>
          Giving Tuesday 2020 is on Dec. 1st
        </h1>
        <p className="donate-bold">
          <a href="https://www.givingtuesday.org/">Giving Tuesday</a>{" "}
          is a global day of giving - please consider donating to one of the most full-featured, collaborative platforms for developing tech-for-good projects! Given these unprecedented times, your donation is now more important than ever.
        </p>
        <p>
          #GivingTuesday was created back in 2012 by the team at the Belfer Center for Innovation & Social Impact at the 92nd Street Y-a cultural center in New York City and has, since then, become a global philanthropic movement. Last year, #GivingTuesday saw a significant increase in donations, growing from $177 million in online donations in 2016 to $511 Million in 2019.
        </p>
      </React.Fragment>
    );
  }
}

export default DonateBlurb;
