// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import { Glyph, GlyphSizes, GlyphStyles } from "../../utils/glyphs.js";
import type { Dictionary } from "../../types/Generics.jsx";

type Props = {|
  buttonConfig: Dictionary<any>,
  participant_count: number,
  className: ?string,
  variant: string,
|};

/**
 * Button for presenting conference links with participant count
 */

class JoinConferenceButton extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <Button
          variant={this.props.variant}
          type="button"
          className={this.props.className}
          {...this.props.buttonConfig}
        >
          <i className={Glyph(GlyphStyles.Video, GlyphSizes.LG) + " mr-3"} />
          {this.props.children}
          <i className={Glyph(GlyphStyles.Users, GlyphSizes.LG) + " ml-3"} />
          <span className="JoinConference-usercount overline ml-1">
            {this.props.participant_count || "0"}
          </span>
        </Button>
      </React.Fragment>
    );
  }
}

export default JoinConferenceButton;
