// @flow

import React from "react";
import ReactMarkdown from "react-markdown";

class AllowMarkdown extends React.PureComponent {
  render(): React$Node {
    // Disallow headers so as not to interfere with set header hierarchy of page
    // Disallow list elements because they interact poorly with pre-wrap
    const disallowedElements: ReadonlyArray<string> = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ol",
      "li",
    ];
    return (
      <ReactMarkdown
        disallowedElements={disallowedElements}
        unwrapDisallowed={true}
      >
        {this.props.children}
      </ReactMarkdown>
    );
  }
}

export default AllowMarkdown;
