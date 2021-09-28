// @flow

import React from "react";
import { Glyph } from "../utils/glyphs.js";

type Props = {|
  toggled: boolean,
  toggleOnIconClass: string,
  toggleOffIconClass: string,
  size: ?string,
|};

class IconToggle extends React.PureComponent<Props> {
  render(): React$Node {
    const iconClass: string = this.props.toggled
      ? this.props.toggleOnIconClass
      : this.props.toggleOffIconClass;
    const sizeClass: string = this.props.size || "";
    return <i className={Glyph(iconClass, sizeClass)}></i>;
  }
}

export default IconToggle;
