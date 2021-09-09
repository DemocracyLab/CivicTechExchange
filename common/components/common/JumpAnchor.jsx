// @flow

import React from "react";
import { Container } from "flux/utils";
import type { FluxReduceStore } from "flux/utils";
import PageOffsetStore from "../stores/PageOffsetStore.js";

type Props = {|
  id: string,
|};

type State = {|
  headerHeight: number,
|};

// Anchor target that adjusts for the top header height
class JumpAnchor extends React.Component<Props, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [PageOffsetStore];
  }

  static calculateState(prevState: State): State {
    return {
      headerHeight: PageOffsetStore.getHeaderHeight(),
    };
  }

  render(): React$Node {
    const style = {
      position: "absolute",
      top: -this.state.headerHeight,
    };

    return (
      <React.Fragment>
        <a id={this.props.id} style={style}></a>
      </React.Fragment>
    );
  }
}

export default Container.create(JumpAnchor);
