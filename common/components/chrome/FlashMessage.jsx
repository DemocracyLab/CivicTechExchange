// @flow

import React from "react";
import { Container } from "flux/utils";
import NavigationStore from "../stores/NavigationStore";
import _ from "lodash";

type State = {|
  section: SectionType,
|};

class FlashMessage extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore];
  }

  static calculateState(prevState: State): State {
    return {
      section: NavigationStore.getSection(),
    };
  }

  componentDidUpdate(prevProps, prevState: State) {
    if (prevState.section !== this.state.section) {
      window.DLAB_MESSAGES = [];
    }
  }

  render(): React$Node {
    return <div className="FlashMessage-root">{this._renderMessages()}</div>;
  }

  _renderMessages(): React$Node {
    return window.DLAB_MESSAGES.map((msg, i) => {
      return (
        <div key={i} className={msg.level}>
          {_.unescape(msg.message)}
        </div>
      );
    });
  }
}

export default Container.create(FlashMessage);
