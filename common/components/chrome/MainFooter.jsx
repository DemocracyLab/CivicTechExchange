// @flow

import cx from '../utils/cx';
import React from 'react';

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
    let envFooterData = window.DLAB_FOOTER_LINKS;
    let parsedFooterData = JSON.parse(_.unescape(envFooterData));
    let footerLinks = parsedFooterData.map((link, i) =>
      <span className="LandingController-footer-link" key={i}>
       <a href={link.u} target="_blank" rel="noopener noreferrer">{link.n}</a>
      </span>
    );
    return (
      <div className="LandingController-footer">
        {footerLinks}
      </div>
    )
  }
}
export default MainFooter;
