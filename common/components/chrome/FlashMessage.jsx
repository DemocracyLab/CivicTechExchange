// @flow

import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';

class FlashMessage extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="FlashMessage-root">
        {this._renderMessages()}
      </div>
    );
  }

  _renderMessages(): React$Node {
    return window.DLAB_MESSAGES.map((msg, i) => {
      return (
          <div key={i} className={msg.level}>
            {msg.message}
          </div>
      )
    })
  }
}

export default FlashMessage;
