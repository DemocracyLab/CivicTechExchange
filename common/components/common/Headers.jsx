// @flow

import React from 'react';
import Helmet from 'react-helmet';

type Props = {|
  +title: string,
  +description: string,
  +thumbnailUrl: ?string
|};

class Headers extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <Helmet>
        <title>{this.props.title}</title>
        <meta name="description" content={this.props.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={this.props.title} />
        <meta property="og:image" content={this.props.thumbnailUrl} />
      </Helmet>
    );
  }
}

export default Headers;
