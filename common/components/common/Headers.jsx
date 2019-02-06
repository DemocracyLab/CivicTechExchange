// @flow

import React from 'react';
import Helmet from 'react-helmet';

type Props = {|
  +title: string,
  +description: string
|};

class Headers extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <Helmet>
        <title>{this.props.title}</title>
        <meta name="description" content={this.props.description} />
      </Helmet>
    );
  }
}

export default Headers;
