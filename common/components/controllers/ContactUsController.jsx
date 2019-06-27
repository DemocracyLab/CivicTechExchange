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
           <p>Want to contact DemocracyLab? We'd love to hear from you. Send us an email at <a href="mailto:hello@democracylab.org">hello@democracylab.org</a> and we'll get back to you.</p>
           <p>Interested in following us elsewhere? You can find us here:</p>
           <ul className="fa-ul">
             <li><a href="https://www.facebook.com/democracylaborg"><span className="fa-li"><i className={Glyph(GlyphStyles.FacebookSquare)}></i></span> Facebook</a></li>
             <li><a href="https://www.linkedin.com/company/democracylab"><span className="fa-li"><i className={Glyph(GlyphStyles.LinkedIn)}></i></span> LinkedIn</a></li>
             <li><a href="https://medium.com/democracylab-org"><span className="fa-li"><i className={Glyph(GlyphStyles.Medium)}></i></span> Medium</a></li>
             <li><a href="https://twitter.com/democracylab"><span className="fa-li"><i className={Glyph(GlyphStyles.TwitterSquare)}></i></span> Twitter</a></li>
           </ul>
         </div>
       </React.Fragment>
     )
   }
}

export default ContactUsController;
