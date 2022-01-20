// @flow

import React from "react";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";

type Props = {|
  message: string,
|};

class LoadingMessage extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
  }

  render() {
    return (
      <div className="loading-message">
        <i className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.X2)}></i>
        <p className="loading-message-text">{this.props.message}</p>
      </div>
    );
  }
}

export default LoadingMessage;
