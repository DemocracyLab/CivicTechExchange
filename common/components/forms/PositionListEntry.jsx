// @flow

import React from "react";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";
import type { NewPositionInfo } from "./PositionList.jsx";

type Props = {|
  position: NewPositionInfo,
  selected: boolean,
  onClickEditPosition: () => void,
  onClickToggleVisibility: () => void,
  onClickDelete: () => void,
|};

type State = {|
  visualStateClass: string,
|};

const VisualStateClasses: Dictionary<string> = {
  Grabbed: " grabbed",
  Dim: " dim",
  Normal: "",
};

/**
 * Project positions list item
 */
class PositionListEntry extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      visualStateClass: this.getVisualState(props),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    this.setState({ visualStateClass: this.getVisualState(nextProps) });
  }

  getVisualState(props: Props): string {
    const _props: Props = props || this.props;
    if (_props.selected) {
      return VisualStateClasses.Grabbed;
    } else if (_props.position.isHidden) {
      return VisualStateClasses.Dim;
    } else {
      return VisualStateClasses.Normal;
    }
  }

  render(): React$Node {
    const position: NewPositionInfo = this.props.position;
    const positionDisplay: string =
      position.roleTag.subcategory + ": " + position.roleTag.display_name;
    const id: string = position.id || position.tempId;
    return (
      <div
        className={"PositionList-entry" + this.state.visualStateClass}
        key={id}
      >
        <div className="left-side">
          <i
            className={Glyph(GlyphStyles.Grip, GlyphSizes.LG + " grip")}
            aria-hidden="true"
          ></i>
          <span>{positionDisplay}</span>
        </div>
        <div className="right-side">
          <i
            className={Glyph(GlyphStyles.Edit, GlyphSizes.LG)}
            aria-hidden="true"
            onClick={this.props.onClickEditPosition}
          ></i>
          <i
            className={Glyph(
              position.isHidden ? GlyphStyles.EyeSlash : GlyphStyles.Eye,
              GlyphSizes.LG
            )}
            aria-hidden="true"
            onClick={this.props.onClickToggleVisibility}
          ></i>
          <i
            className={Glyph(GlyphStyles.Delete, GlyphSizes.LG)}
            aria-hidden="true"
            onClick={this.props.onClickDelete}
          ></i>
        </div>
      </div>
    );
  }
}

export default PositionListEntry;
