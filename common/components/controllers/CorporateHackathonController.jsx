// @flow

import React from 'react';
import Headers from "../common/Headers.jsx";
import ContactForm from "../forms/ContactForm.jsx";
import prerender from "../utils/prerender.js";

class CorporateHackathonController extends React.PureComponent<{||}> {
  componentDidMount() {
    prerender.ready();
  }

  _renderHeader(): React$Node {
    const title: string = "DemocracyLab | Corporate Hackathons";
    const description: string = "Host a hackathon with DemocracyLab!"

    return (
      <Headers
        title={title}
        description={description}
      />
    );
  }

   render(): $React$Node {
     return (
       <React.Fragment>
        {this._renderHeader()}
         <div className="container corporate-hackathon-root">
           <h1>Page Title</h1>
           <p>Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content. Page content.</p>
         </div>
       </React.Fragment>
     )
   }
}

export default CorporateHackathonController;
