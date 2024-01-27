// @flow

import EventCardsContainer from "../componentsBySection/FindEvents/EventCardsContainer.jsx";
import React from "react";
import urls from "../utils/url.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import { SearchFor } from "../stores/EntitySearchStore.js";
import _ from "lodash";

class FindEventsController extends React.PureComponent {
  constructor(): void {
    super();
    init();
  }

  init(): void {
    let args = urls.arguments(document.location.search);
    args = _.pick(args, ["keyword", "page"]);
    UniversalDispatcher.dispatch({
      type: "INIT_SEARCH",
      findEventsArgs: !_.isEmpty(args) ? args : null,
      searchSettings: {
        updateUrl: true,
        searchConfig: SearchFor.Events,
      },
    });
  }

  //TODO: When enabling EventfilterContainer, remove "justify-content-center" class from row div
  render(): React$Node {
    return (
      <React.Fragment>
        <div className="FindEventsController-root">
          <div className="container">
            <div className="row justify-content-center">
              <EventCardsContainer showSearchControls={true} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FindEventsController;
