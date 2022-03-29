// @flow

import React from "react";
import ReactToast from "react-bootstrap/Toast";

type Props = {|
  timeoutMilliseconds: number,
  show: boolean,
  onClose: () => void,
|};
type State = {
  show: boolean,
};

/**
 * Wrapper for toast messages
 */
class Toast extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = { show: props.show };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ show: nextProps.show });
  }

  render(): React$Node {
    // TODO: Add close X
    // TODO: Add styling for success message according to designs
    return (
      this.props.show && (
        <ReactToast
          onClose={() => this.props.onClose()}
          show={this.props.show}
          delay={this.props.timeoutMilliseconds || 3000}
          autohide
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
          }}
        >
          <ReactToast.Body>{this.props.children}</ReactToast.Body>
        </ReactToast>
      )
    );
  }
}

export default Toast;
