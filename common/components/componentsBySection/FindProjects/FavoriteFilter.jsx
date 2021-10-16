// @flow

import React from "react";
import { Container } from "flux/utils";
import IconToggle from "../../chrome/IconToggle.jsx";
import { Glyph, GlyphStyles, GlyphSizes } from "../../utils/glyphs.js";
import ProjectSearchStore from "../../stores/ProjectSearchStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import metrics from "../../utils/metrics.js";

type Props = {|
  isMobileLayout: boolean,
|};

type State = {|
  favoritesOnly: boolean,
|};

class FavoriteFilter extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      favoritesOnly: false,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    const state: State = {
      favoritesOnly: ProjectSearchStore.getFavoritesOnly(),
    };

    return state;
  }

  doToggle(): void {
    const newFavoritesOnly: boolean = !this.state.favoritesOnly;
    UniversalDispatcher.dispatch({
      type: "SET_FAVORITES_ONLY",
      favoritesOnly: newFavoritesOnly,
    });
    metrics.logFilterProjectsByFavorite(newFavoritesOnly);
  }

  render(): React$Node {
    const className: string = this.props.isMobileLayout
      ? "favorite-filter"
      : "favorite-filter btn btn-outline-secondary";
    return (
      <div className={className} onClick={this.doToggle.bind(this)}>
        Favorites
        <IconToggle
          toggled={this.state.favoritesOnly}
          toggleOnIconClass={Glyph(GlyphStyles.HeartFilled, " favorited")}
          toggleOffIconClass={Glyph(GlyphStyles.HeartEmpty, " unfavorited")}
        />
      </div>
    );
  }
}

export default Container.create(FavoriteFilter);
