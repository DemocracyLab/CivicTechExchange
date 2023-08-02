// @flow

import React from "react";
import { Container } from "flux/utils";
import { ProjectData } from "../../utils/ProjectAPIUtils.js";
import CurrentUser, { UserContext } from "../../utils/CurrentUser.js";
import IconToggle from "../../chrome/IconToggle.jsx";
import { GlyphStyles, GlyphSizes, Glyph } from "../../utils/glyphs.js";
import FavoritesStore from "../../stores/FavoritesStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";

type Props = {|
  project: ProjectData,
|};

type State = {|
  favorited: boolean,
|};

class FavoriteToggle extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      favorited:
        userContext.favorites && userContext.favorites[props.project.id],
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FavoritesStore];
  }

  static calculateState(prevState: State, props: Props): State {
    const state: State = {
      favorited: FavoritesStore.isFavoriteProject(props.project.id),
    };

    return state;
  }

  doToggle(event): void {
    event.preventDefault();
    UniversalDispatcher.dispatch({
      type: "SET_FAVORITE",
      projectId: this.props.project.id,
      favorited: !this.state.favorited,
    });
  }

  render(): React$Node {
    return (
      <div className={"favorite-toggle"} onClick={this.doToggle.bind(this)}>
        <IconToggle
          toggled={this.state.favorited}
          toggleOnIconClass={Glyph(GlyphStyles.HeartFilled, " favorited")}
          toggleOffIconClass={Glyph(GlyphStyles.HeartEmpty, " unfavorited")}
        />
      </div>
    );
  }
}

export default Container.create(FavoriteToggle, { withProps: true });
