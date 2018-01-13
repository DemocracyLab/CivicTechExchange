// @flow

import type {SectionType} from '../enums/Section.js';

import cx from '../utils/cx';
import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';

type Props = {|
  +activeSection: SectionType,
  +section: SectionType,
  +title: string,
|};

class SectionLink extends React.PureComponent<Props> {

  _cx: cx;

  constructor(): void {
    super();
    this._cx = new cx('SectionLink-');
  }

  render(): React$Node {
    return (
      <div
        className={this._cx.get(...this._getClassNames())}
        onClick={this._onChangeSection.bind(this)}
        >
        {this.props.title}
      </div>
    );
  }

  _getClassNames(): $ReadOnlyArray<string> {
    return this.props.section === this.props.activeSection
      ? ['root', 'active']
      : ['root'];
  }

  _onChangeSection(): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: this.props.section,
      url: '/index/?section=' + this.props.section
    });
    window.FB.AppEvents.logEvent(
      'sectionLinkClick',
      null,
      {section: this.props.section},
    );
  }
}

export default SectionLink;
