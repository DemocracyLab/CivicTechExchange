// @flow

import React from "react";
import ReactMarkdown from "react-markdown";

class AllowMarkdown extends React.PureComponent {
  render(): React$Node {
    const disallowedElements: ReadonlyArray<string> = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ];
    return (
      <ReactMarkdown disallowedElements={disallowedElements}>
        {this.props.children}
      </ReactMarkdown>
    );
  }
}

export default AllowMarkdown;
