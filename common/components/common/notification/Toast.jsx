// @flow

import React from "react";
import ReactToast from "react-bootstrap/Toast";

type Props = {|
  timeoutMilliseconds: number,
  header: ?string,
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
          {this.props.header
            ? this._renderMessageWithHeaderBody()
            : this._renderSingleMessageBody()}
        </ReactToast>
      )
    );
  }

  _renderSingleMessageBody(): React$Node {
    return (
      <React.Fragment>
        <ReactToast.Header />
        <ReactToast.Body>
          <strong>{this.props.children}</strong>
        </ReactToast.Body>
      </React.Fragment>
    );
  }

  _renderMessageWithHeaderBody(): React$Node {
    return (
      <React.Fragment>
        <ReactToast.Header>
          <strong>{this.props.header}</strong>
        </ReactToast.Header>
        <ReactToast.Body>{this.props.children}</ReactToast.Body>
      </React.Fragment>
    );
  }
}

export default Toast;
