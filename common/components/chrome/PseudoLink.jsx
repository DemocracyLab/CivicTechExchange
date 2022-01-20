// @flow

import React from "react";

type Props = {|
  +text: string,
  +onClick: () => void,
|};

class PseudoLink extends React.PureComponent<Props> {
  onClick(e): void {
    // Prevent any page navigation
    e.preventDefault();
    this.props.onClick();
  }

  render(): React$Node {
    // TODO: Implement with styled text instead of anchor
    return (
      <a href="#" onClick={this.onClick.bind(this)}>
        {this.props.text}
      </a>
    );
  }
}

export default PseudoLink;
