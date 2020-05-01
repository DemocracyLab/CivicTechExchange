// @flow

import React from 'react';
import _ from 'lodash';

class LiveEventController extends React.Component<{||}> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="LiveEvent-root">
        <iframe src={_.unescape(window.QIQO_IFRAME_URL)} width="100%" height="800">
        
        </iframe>
      </div>
    );
  }
}

export default LiveEventController;
