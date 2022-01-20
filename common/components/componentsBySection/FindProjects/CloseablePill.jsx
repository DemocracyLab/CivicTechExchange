// @flow

import GlyphStyles from "../../utils/glyphs.js";
import React from "react";

type Props = {|
  label: string,
  closeAction: () => void,
|};

class CloseablePill extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <span className="ProjectTag-root">
        {this.props.label}
        {this._renderCloseButton()}
      </span>
    );
  }

  onClickCloseButton(event) {
    event.stopPropagation();
    this.props.closeAction();
  }

  _renderCloseButton(): React$Node {
    return (
      <span
        className="ProjectTag-closeButton"
        onClick={this.onClickCloseButton.bind(this)}
      >
        <i className={GlyphStyles.Close}></i>
      </span>
    );
  }
}

export default CloseablePill;
