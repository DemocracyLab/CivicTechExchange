// @flow

import React from 'react';

type Props = {|
  onClickFindProjects: () => void
|};

function unescapeHtml(html: string): string {
  let escapeEl = document.createElement('textarea');
  escapeEl.innerHTML = html;
  return escapeEl.textContent;
}

class AlertHeader extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <div className="AlertHeader-root">
        <div className="AlertHeader-text" dangerouslySetInnerHTML={{__html: unescapeHtml(window.HEADER_ALERT)}}/>
        <div className="AlertHeader-close">
          X
        </div>
      </div>
    );
  }
  
}
export default AlertHeader;
