import React from 'react';
import Section from '../enums/Section.js';

class MainHeader extends React.Component {
  render() {
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
