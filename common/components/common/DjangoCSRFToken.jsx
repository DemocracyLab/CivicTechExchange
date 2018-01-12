// @flow

import React from 'react'

type Props = {||};
type State = {|
  csrftoken: string
|};

/**
 * Extract Django's csrf token from cookies and put in hidden form field
 */
class DjangoCSRFToken extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    
    this.state = {
      csrftoken: (new RegExp("csrftoken=([^;]+)")).exec(document.cookie)[1]
    };
  }
  
  render(): React$Node {
    return (
      <input type="hidden" name="csrfmiddlewaretoken" value={this.state.csrftoken} />
    );
  }
}

export default DjangoCSRFToken;