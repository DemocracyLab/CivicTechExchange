// @flow

import React from 'react';
import Headers from "../common/Headers.jsx";
import {Glyph, GlyphStyles} from "../utils/glyphs.js"

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
           <p>Want to contact DemocracyLab? We'd love to hear from you. Send us an email at <a href='mailto&#58;h&#101;llo%&#52;&#48;democr&#97;c&#37;79%6Cab&#46;&#111;&#37;&#55;2%6&#55;'>&#104;e&#108;lo&#64;democracy&#108;ab&#46;&#111;&#114;&#103;</a> and we'll get back to you.</p>
           
         </div>
       </React.Fragment>
     )
   }
}

export default ContactUsController;
