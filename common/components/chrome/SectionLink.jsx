import cx from '../utils/cx';
import React from 'react';

class SectionLink extends React.Component {
  constructor() {
    super();
    this._cx = new cx('SectionLink-');
  }

  render() {
    return (
      <div
        className={this._cx.get(...this._getClassNames())}
        onClick={this.props.onChangeSection}
        >
        {this.props.title}
      </div>
    );
  }

  _getClassNames() {
    return this.props.section === this.props.activeSection
      ? ['root', 'active']
      : ['root'];
  }
}

export default SectionLink;
