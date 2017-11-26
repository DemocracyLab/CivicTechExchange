// @flow

import type {SectionType} from '../enums/Section.js';

import cx from '../utils/cx';
import React from 'react';

type Props = {|
  +activeSection: SectionType,
  +onChangeSection: (SectionType) => void,
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
        onClick={this.props.onChangeSection}
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
}

export default SectionLink;
