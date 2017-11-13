import React, { Component } from 'react';

class MainHeader extends Component {
  render() {
    return (
      <div className="MainHeader-root">
        <span>[DLAB LOGO]</span>
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

