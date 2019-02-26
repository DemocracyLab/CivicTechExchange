// @flow

import React from 'react';

type Props = {|
  onClickFindProjects: () => void
|};

type State = {|
  showHeader: boolean
|};

// Put string html content into a format that dangerouslySetInnerHTML accepts
function unescapeHtml(html: string): string {
  let escapeEl = document.createElement('textarea');
  escapeEl.innerHTML = html;
  return escapeEl.textContent;
}

class AlertHeader extends React.PureComponent<Props, State> {
  constructor(): void {
    super();
    this.state = {showHeader: true};
    // TODO: Uncomment when finished
    // this.state = {showHeader: !sessionStorage["hideAlertHeader"]};
  }
  
  hideHeader(): void {
    sessionStorage["hideAlertHeader"] = true;
    this.setState({showHeader: false});
  }
  
  render(): ?React$Node {
    return this.state.showHeader && (
      <div className="AlertHeader-root">
        <div className="AlertHeader-text" dangerouslySetInnerHTML={{__html: unescapeHtml(window.HEADER_ALERT)}}/>
        <div className="AlertHeader-close" onClick={() => this.hideHeader()}>
          X
        </div>
      </div>
    );
  }
  
}
export default AlertHeader;
