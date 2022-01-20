// @flow

import React, { SyntheticEvent } from "react";
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import GlyphStyles from "../../utils/glyphs.js";
import metrics from "../../utils/metrics.js";
import GroupSearchStore from "../../stores/GroupSearchStore.js";
import GroupSearchDispatcher from "../../stores/GroupSearchDispatcher.js";

type State = {|
  keyword: string,
|};

class GroupSearchBar extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [GroupSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: GroupSearchStore.getKeyword() || "",
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
          placeholder="Search Groups"
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
    GroupSearchDispatcher.dispatch({
      type: "SET_KEYWORD",
      keyword: this.state.keyword,
    });
    metrics.logGroupSearchByKeywordEvent(this.state.keyword);
  }
}

export default Container.create(GroupSearchBar);
