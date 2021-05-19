// @flow

import React from "react";
import { PositionInfo } from "./PositionInfo.jsx";
import { Glyph, GlyphStyles, GlyphSizes } from "../utils/glyphs.js";

type Props = {|
  position: PositionInfo,
  onClickEditPosition: () => void,
  onClickToggleVisibility: () => void,
  onClickDelete: () => void,
|};
type State = {||};

/**
 * Project positions list item
 */
class PositionListEntry extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
  }

  componentWillReceiveProps(nextProps: Props): void {}

  render(): React$Node {
    const position: PositionInfo = this.props.position;
    const positionDisplay: string =
      position.roleTag.subcategory + ": " + position.roleTag.display_name;
    const id: string = position.id || positionDisplay;
    return (
      <div className="PositionList-entry" key={id}>
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
              GlyphStyles.Eye,
              GlyphSizes.LG,
              position.isHidden ? " dim" : ""
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
