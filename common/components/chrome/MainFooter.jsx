// @flow

import cx from '../utils/cx';
import React from 'react';
import _ from 'lodash';

class MainFooter extends React.PureComponent<{||}> {
  
  _cx: cx;
  
  constructor(): void {
    super();
    this._cx = new cx('LandingController-');
  }
  
  render(): React$Node {
    return (
      <div>
        {this._renderFooter()}
      </div>
    );
  }
  
  _renderFooter(): React$Node {
    let footerLinks = null;
    try {
      let envFooterData = window.DLAB_FOOTER_LINKS;
      let parsedFooterData = JSON.parse(_.unescape(envFooterData));
      footerLinks = parsedFooterData.map((link, i) =>
        <span className="LandingController-footer-link" key={i}>
         <a href={link.u} target="_blank" rel="noopener noreferrer">{link.n}</a>
        </span>
      );
    } catch(ex) {
      console.error("Failed to parse footer links. ", ex);
    }

    return (
      footerLinks
        ? <div className="LandingController-footer"> {footerLinks} </div>
        : null
    )
  }
}
export default MainFooter;
