// @flow

import React from "react";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";

type Props = {|
  height: string,
|};

class LoadingFrame extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
  }

  render() {
    return (
      <div className="loading-frame" style={{ minHeight: this.props.height }}>
        <i className={Glyph(GlyphStyles.LoadingSpinner, GlyphSizes.X2)}></i>
      </div>
    );
  }
}

export default LoadingFrame;
