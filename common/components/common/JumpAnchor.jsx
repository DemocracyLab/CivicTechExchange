// @flow

import React from "react";

type Props = {|
  id: string,
  headerHeight: number,
|};

// Anchor target that adjusts for the top header height
class JumpAnchor extends React.Component<Props, State> {

  render(): React$Node {
    const style = {
      position: "absolute",
      top: -this.props.headerHeight,
    };

    return (
      <React.Fragment>
        <a id={this.props.id} style={style}></a>
      </React.Fragment>
    );
  }
}

export default JumpAnchor;
