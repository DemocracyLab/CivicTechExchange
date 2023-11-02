// @flow

import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import ProjectCardsContainer from "../componentsBySection/FindProjects/ProjectCardsContainer.jsx";
import ProjectFilterContainer from "../componentsBySection/FindProjects/Filters/ProjectFilterContainer.jsx";
import { FindProjectsArgs, SearchFor } from "../stores/EntitySearchStore.js";

import urls from "../utils/url.js";
import React from "react";
import _ from "lodash";

class FindProjectsController extends React.PureComponent {
  constructor(): void {
    super();
    this.state = { showSplash: true };
  }

  componentWillMount(): void {
    let searchDecoded = decodeURIComponent(document.location.search);
    let args: FindProjectsArgs = urls.arguments(searchDecoded);
    args = _.pick(args, [
      "showSplash",
      "keyword",
      "sortField",
      "location",
      "locationRadius",
      "page",
      "issues",
      "tech",
      "role",
      "org",
      "orgType",
      "stage",
      "favoritesOnly",
    ]);
    if (!args.sortField) {
      args.sortField = "-project_date_modified";
    }

    UniversalDispatcher.dispatch({
      type: "INIT_SEARCH",
      findProjectsArgs: !_.isEmpty(args) ? args : null,
      searchSettings: {
        updateUrl: true,
        searchConfig: SearchFor.Projects,
      },
    });
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <div className="FindProjectsController-root container">
          <div className="row">
            <ProjectFilterContainer />
            <ProjectCardsContainer showSearchControls={true} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FindProjectsController;
