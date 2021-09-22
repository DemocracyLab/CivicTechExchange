// @flow

import React from "react";
import { Container } from "flux/utils";
import IconToggle from "../../chrome/IconToggle.jsx";
import { GlyphStyles, GlyphSizes } from "../../utils/glyphs.js";
import ProjectSearchStore from "../../stores/ProjectSearchStore.js";
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";
import metrics from "../../utils/metrics";

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
    ProjectSearchDispatcher.dispatch({
      type: "SET_FAVORITES_ONLY",
      favoritesOnly: newFavoritesOnly,
    });
    metrics.logFilterProjectsByFavorite(newFavoritesOnly);
  }

  render(): React$Node {
    return (
      <div className="favorite-toggle" onClick={this.doToggle.bind(this)}>
        <IconToggle
          toggled={this.state.favoritesOnly}
          toggleOnIcon={GlyphStyles.HeartFilled}
          toggleOffIcon={GlyphStyles.HeartEmpty}
          size={GlyphSizes.X2}
        />
        Favorites
      </div>
    );
  }
}

export default Container.create(FavoriteFilter);
