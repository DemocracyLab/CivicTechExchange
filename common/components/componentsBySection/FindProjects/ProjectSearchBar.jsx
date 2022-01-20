// @flow

import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import ProjectSearchStore from "../../stores/ProjectSearchStore.js";
import GlyphStyles from "../../utils/glyphs.js";
import metrics from "../../utils/metrics.js";
import React, { SyntheticEvent } from "react";

type Props = {|
  placeholder: string,
|};

type State = {|
  keyword: string,
|};

class ProjectSearchBar extends React.Component<{||}, Props, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: ProjectSearchStore.getKeyword() || "",
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

export default Container.create(ProjectSearchBar);
