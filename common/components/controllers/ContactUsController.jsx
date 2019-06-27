// @flow

import React from 'react';
import Headers from "../common/Headers.jsx";

class ContactUsController extends React.PureComponent<{||}> {

  _renderHeader(): React$Node {
    const title: string = "DemocracyLab | Contact Us";
    const description: string = "Contact information for DemocracyLab."

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
         <div className="container contact-us-root">
           <h1>Contact Us</h1>
           <p>Words about contacting us with some links go here</p>
         </div>
       </React.Fragment>
     )
   }
}

export default ContactUsController;
