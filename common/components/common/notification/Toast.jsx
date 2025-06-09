// @flow

import React from "react";
import ReactToast from "react-bootstrap/Toast";
import { Container } from "flux/utils";
import type { FluxReduceStore } from "flux/utils";
import PageOffsetStore from "../../stores/PageOffsetStore.js";
import { Glyph, GlyphStyles, GlyphSizes } from "../../utils/glyphs.js";

type Props = {|
  timeoutMilliseconds: number,
  header: ?string,
  animation:?boolean,
  show: boolean,
  onClose: () => void,
|};
type State = {
  show: boolean,
  headerHeight: number,
};

/**
 * Wrapper for toast messages
 */
class Toast extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = { show: props.show, headerHeight: 0 };
  }
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [PageOffsetStore];
  }
  static calculateState(prevState: State): State {
    return {
      headerHeight: PageOffsetStore.getHeaderHeight(),
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ show: nextProps.show });
  }

  render(): React$Node {
    const {animation=false,show,timeoutMilliseconds,header,onClose} = this.props;
    const offsetVal = this.state.headerHeight + 20;
    // TODO: Add styling for success message according to designs
    // TODO: pass autohide via prop rather than forcing it to always-on here
    const style = {
      position: "fixed",
      top: `${offsetVal}px`,
      right: 0,
    };
    return (
        <ReactToast
          className={(animation)? "Toast-animation":null}
          onClose={() => onClose()}
          show={show}
          style={style}
          delay={timeoutMilliseconds || 5000}
          autohide
          animation={animation}
        >
          {header
            ? this._renderMessageWithHeaderBody()
            : this._renderSingleMessageBody()}
        </ReactToast>
    );
  }

  _renderSingleMessageBody(): React$Node {
    //because single message suppresses the header, the close button is replicated in the body
    return (
      <React.Fragment>
        <ReactToast.Header className="d-none" />
        <ReactToast.Body className="toast-no-header-body toast-body">
          <i
            className={Glyph(GlyphStyles.CircleCheck, GlyphSizes.LG)}
            aria-hidden="true"
          ></i>
          <strong>{this.props.children}</strong>
          <button
            type="button"
            class="close ml-2 mb-1"
            data-dismiss="toast"
            onClick={this.props.onClose}
          >
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
        </ReactToast.Body>
      </React.Fragment>
    );
  }

  _renderMessageWithHeaderBody(): React$Node {
    return (
      <React.Fragment>
        <ReactToast.Header>
          <i
            className={Glyph(GlyphStyles.CircleCheck, GlyphSizes.LG)}
            aria-hidden="true"
          ></i>
          <strong>{this.props.header}</strong>
        </ReactToast.Header>
        <ReactToast.Body className="toast-body toast-with-header-body">
          {this.props.children}
        </ReactToast.Body>
      </React.Fragment>
    );
  }
}

export default Container.create(Toast);
