// @flow

//TODO: validate all the active imports, these are the result of a messy merge
import React from 'react';
import _ from 'lodash'
// import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
// import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
// import metrics from "../utils/metrics.js";

// type State = {|
//   aboutUs: ?ProjectDetailsAPIData,
// |};

class AboutUsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
    aboutUs: 'this is a test string',
    }
  }


  render(): $React$Node {
    return this.state.aboutUs ? this._renderAboutUs() : <div>Loading...</div>
  }

  _renderAboutUs(): React$Node {
    return ( <section><p>About Us!</p></section> )
  }
}

export default AboutUsController;
