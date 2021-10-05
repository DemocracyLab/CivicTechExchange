// @flow

import React, { forwardRef } from "react";
import type { Dictionary } from "../types/Generics.jsx";

type Props = {|
  show: boolean,
  direction: string,
  sourceRef: forwardRef,
  frameRef: (props, ref) => forwardRef,
  onHide: () => void,
|};

type State = {|
  popoverTop: number,
  popoverLeft: number,
|};

class PopOut extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.frameRef = React.createRef();
    this.state = this.generateFrameLocation();
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.generateFrameLocation(nextProps));
  }

  generateFrameLocation(props: Props): State {
    let state: State = {};
    if (props && props.sourceRef && props.sourceRef.current) {
      const sourceRect: DOMRect = props.sourceRef.getBoundingClientRect();
      state = {
        popoverLeft: sourceRect.left,
        popoverTop: sourceRect.bottom,
      };
    }
    return state;
  }

  render(): React$Node {
    // TODO: Add background frame that closes popout
    const frameElement: React$Node = this.props.frameRef(
      this.props,
      this.frameRef
    );
    const style: Dictionary<string> = {
      top: this.state.popoverTop,
      left: this.state.popoverLeft,
    };
    if (!this.props.show) {
      style.display = "none";
    }
    return (
      <React.Fragment>
        <div className="popout-frame" style={style}>
          {frameElement}
        </div>
      </React.Fragment>
    );
  }
}

export default PopOut;
