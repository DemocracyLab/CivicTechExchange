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

  _renderCloseButton(): React$Node {
    return (
      <span className="ProjectTag-closeButton" onClick={this.props.closeAction}>
        <i className={GlyphStyles.Close}></i>
      </span>
    );
  }
}

export default CloseablePill;
