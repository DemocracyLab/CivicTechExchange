// @flow

import type {SectionType} from '../enums/Section.js';

import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
import Section from '../enums/Section.js';

class MainHeader extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="MainHeader-root">
        <span onClick={this._onHomeButtonClick}>
          <img
            className="MainHeader-logo"
            src="https://i.imgur.com/jvnaJWz.png"
          />
        </span>
        <span className="MainHeader-rightContent">
          <span>
            {this._renderLinks()}
          </span>
          <img
            className="MainHeader-profilePicture"
            src="https://avatars2.githubusercontent.com/u/3479724?s=400&u=d8619269a20955dd8df8215d1c41faad9b6fb62a&v=4"
          />
        </span>
      </div>
    );
  }

  _onHomeButtonClick(): void {
    NavigationDispatcher.dispatch({
      type: 'SET_SECTION',
      section: Section.Landing,
    });
  }

  _renderLinks(): React$Node {
    return [
      'About',
      'Notifications',
      'Messages',
    ].map(link => <span className="MainHeader-link" key={link}>{link}</span>);
  }
}

export default MainHeader;
