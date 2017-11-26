// @flow

import type {SectionType} from '../enums/Section.js';

import React from 'react';
import Section from '../enums/Section.js';

type Props = {|
  +onChangeSection: (SectionType) => void,
|};

class MainHeader extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <div className="MainHeader-root">
        <span
          onClick={() => this.props.onChangeSection(Section.Landing)}>
          [DLAB LOGO]
        </span>
        <span className="MainController-rightContent">
          <span>About</span>
          <span>Notifications</span>
          <span>Messages</span>
          <span>[PROF PIC]</span>
        </span>
      </div>
    );
  }
}

export default MainHeader;
