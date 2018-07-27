// @flow

import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import Section from '../enums/Section.js';
import CurrentUser from '../utils/CurrentUser.js';
import url from '../utils/url.js';

class FlashMessage extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="FlashMessage-root">
        {this._renderMessages()}
      </div>
    );
  }

  _renderMessages(): React$Node {
    return window.DLAB_GLOBAL_CONTEXT.messages.map((msg, i) => {
      return (
          <div key={i} className={msg.level}>
            {msg.message}
          </div>
      )
    })
  }
}

export default FlashMessage;
