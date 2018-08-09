// @flow

import React from 'react';
import _ from 'lodash';
import FooterLinks from "../utils/FooterLinks.js";

class MainFooter extends React.PureComponent<{||}> {
  
  constructor(): void {
    super();
  }
  
  render(): React$Node {
    return (
      <div>
        {this._renderFooter()}
      </div>
    );
  }
  
  _renderFooter(): React$Node {
    const footerLinks: $ReadOnlyArray<FooterLink> = FooterLinks.list().map((link, i) =>
      <span className="MainFooter-footer-link" key={i}>
         <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
        </span>
    );
    
    return (
      FooterLinks.list()
        ? <div className="MainFooter-footer"> {footerLinks} </div>
        : null
    )
  }
}
export default MainFooter;
