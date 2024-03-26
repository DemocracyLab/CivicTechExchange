// @flow

import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import EntitySearchStore from "../../stores/EntitySearchStore.js";
import GlyphStyles from "../../utils/glyphs.js";
import metrics from "../../utils/metrics.js";
import React, { SyntheticEvent } from "react";

type Props = {|
  placeholder: string,
|};

type State = {|
  keyword: string,
|};

class EntitySearchBar extends React.Component<{||}, Props, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: EntitySearchStore.getKeyword() || "",
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectSearchBar-root">
        <i className={GlyphStyles.Search}></i>
        <input
          className="ProjectSearchBar-input"
          onChange={e => this.setState({ keyword: e.target.value })}
          onKeyPress={this._handleKeyPress.bind(this)}
          placeholder={
            this.props.placeholder || "Search tech-for-good projects"
          }
          value={this.state.keyword}
        />
      </div>
    );
  }

  _handleKeyPress(e: SyntheticEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      this._onSubmitKeyword();
    }
  }

  _onSubmitKeyword(): void {
    UniversalDispatcher.dispatch({
      type: "SET_KEYWORD",
      keyword: this.state.keyword,
    });
    metrics.logSearchByKeywordEvent(this.state.keyword);
  }
}

export default Container.create(EntitySearchBar);
