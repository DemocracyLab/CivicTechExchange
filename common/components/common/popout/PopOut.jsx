// @flow

import React from "react";
import type { Dictionary } from "../../types/Generics.jsx";

type Props = {|
  show: boolean,
  source: React$Node,
  frame: React$Node,
  onHide: () => void,
|};

type State = {|
  popoverTop: number,
  popoverLeft: number,
|};

class PopOut extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.sourceRef = React.createRef();
    this.frameRef = React.createRef();
    this.state = this.generateFrameLocation();
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.generateFrameLocation(nextProps));
  }

  generateFrameLocation(props: Props): State {
    let state: State = {};
    if (props && props.source && this.sourceRef.getBoundingClientRect) {
      const sourceRect: DOMRect = this.sourceRef.getBoundingClientRect();
      state = {
        popoverLeft: sourceRect.left,
        popoverTop: sourceRect.bottom,
      };
    }
    return state;
  }

  onClickOut(): void {
    this.props.onHide();
  }

  render(): React$Node {
    const style: Dictionary<string> = {
      top: this.state.popoverTop,
      left: this.state.popoverLeft,
    };
    if (!this.props.show) {
      style.display = "none";
    }
    return (
      <React.Fragment>
        <div ref={this.sourceRef}>{this.props.source}</div>
        <div
          className="popout-clickout"
          style={style}
          onClick={this.onClickOut.bind(this)}
        />
        <div className="popout-frame" style={style} ref={this.frameRef}>
          {this.props.frame}
        </div>
      </React.Fragment>
    );
  }
}

export default PopOut;
