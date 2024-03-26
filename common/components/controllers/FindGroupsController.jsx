// @flow

import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import { SearchFor } from "../stores/EntitySearchStore.js";
import GroupCardsContainer from "../componentsBySection/FindGroups/GroupCardsContainer.jsx";
import GroupFilterContainer from "../componentsBySection/FindGroups/FIlters/GroupFilterContainer.jsx";
import urls from "../utils/url.js";
import React from "react";
import _ from "lodash";

type FindGroupsArgs = {|
  keyword: string,
  sortField: string,
  locationRadius: string,
  page: number,
  issues: string,
|};

class FindGroupsController extends React.PureComponent {
  constructor(): void {
    super();
    this.state = { showSplash: true };
  }

  componentWillMount(): void {
    let args: FindGroupsArgs = urls.arguments(document.location.search);
    args = _.pick(args, [
      "showSplash",
      "keyword",
      "sortField",
      "locationRadius",
      "page",
      "issues",
    ]);
    UniversalDispatcher.dispatch({
      type: "INIT_SEARCH",
      findGroupsArgs: !_.isEmpty(args) ? args : null,
      searchSettings: {
        updateUrl: true,
        searchConfig: SearchFor.Groups,
      },
    });
  }

  // TODO: Splash
  render(): React$Node {
    return (
      <React.Fragment>
        <div className="FindProjectsController-root container">
          <div className="row">
            <GroupFilterContainer />
            <GroupCardsContainer showSearchControls={true} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FindGroupsController;
