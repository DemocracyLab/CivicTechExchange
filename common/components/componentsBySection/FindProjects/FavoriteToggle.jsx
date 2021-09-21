// @flow

import React from "react";
import { ProjectData } from "../../utils/ProjectAPIUtils.js";
import CurrentUser, { UserContext } from "../../utils/CurrentUser.js";
import IconToggle from "../../chrome/IconToggle.jsx";
import { GlyphStyles, GlyphSizes } from "../../utils/glyphs.js";

type Props = {|
  project: ProjectData,
|};

type Stage = {|
  favorited: boolean,
|};

class FavoriteToggle extends React.PureComponent<Props, Stage> {
  constructor(props: Props): void {
    super(props);
    const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      favorited:
        userContext.favorites && userContext.favorites[props.project.id],
    };
  }

  render(): React$Node {
    return (
      <div className="favorite-toggle">
        <IconToggle
          toggled={this.state.favorited}
          toggleOnIcon={GlyphStyles.HeartFilled}
          toggleOffIcon={GlyphStyles.HeartEmpty}
          size={GlyphSizes.X2}
        />
      </div>
    );
  }
}

export default FavoriteToggle;
