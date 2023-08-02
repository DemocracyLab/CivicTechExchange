// @flow

import React from "react";
import { Container } from "flux/utils";
import IconToggle from "../../chrome/IconToggle.jsx";
import { Glyph, GlyphStyles, GlyphSizes } from "../../utils/glyphs.js";
import EntitySearchStore from "../../stores/EntitySearchStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import metrics from "../../utils/metrics.js";

type State = {|
  favoritesOnly: boolean,
|};

class FavoriteFilter extends React.Component<{||}, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      favoritesOnly: false,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    const state: State = {
      favoritesOnly: EntitySearchStore.getFavoritesOnly(),
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
    return (
      <div className="favorite-filter" onClick={this.doToggle.bind(this)}>
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
