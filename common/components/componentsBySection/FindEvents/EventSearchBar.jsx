// @flow

import React, { SyntheticEvent } from "react";
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import GlyphStyles from "../../utils/glyphs.js";
import metrics from "../../utils/metrics.js";
import EventSearchStore from "../../stores/EventSearchStore.js";
import EventSearchDispatcher from "../../stores/EventSearchDispatcher.js";

type State = {|
  keyword: string,
|};

class EventSearchBar extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EventSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: EventSearchStore.getKeyword() || "",
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
          placeholder="Search Events"
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
    EventSearchDispatcher.dispatch({
      type: "SET_KEYWORD",
      keyword: this.state.keyword,
    });
    metrics.logEventSearchByKeywordEvent(this.state.keyword);
  }
}

export default Container.create(EventSearchBar);
