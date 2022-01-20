// @flow

import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import TagDispatcher from "../stores/TagDispatcher.js";
import ProjectCardsContainer from "../componentsBySection/FindProjects/ProjectCardsContainer.jsx";
import ProjectFilterContainer from "../componentsBySection/FindProjects/Filters/ProjectFilterContainer.jsx";
import { FindProjectsArgs } from "../stores/ProjectSearchStore.js";
import Headers from "../common/Headers.jsx";
import urls from "../utils/url.js";
import React from "react";
import _ from "lodash";

class FindProjectsController extends React.PureComponent {
  constructor(): void {
    super();
    this.state = { showSplash: true };
  }

  componentWillMount(): void {
    let args: FindProjectsArgs = urls.arguments(document.location.search);
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
      "stage",
      "favoritesOnly",
    ]);
    if (!args.sortField) {
      args.sortField = "-project_date_modified";
    }

    UniversalDispatcher.dispatch({
      type: "INIT_PROJECT_SEARCH",
      findProjectsArgs: !_.isEmpty(args) ? args : null,
      searchSettings: {
        updateUrl: true,
        defaultSort: "-project_date_modified",
      },
    });
    TagDispatcher.dispatch({ type: "INIT" });
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <Headers
          title="DemocracyLab"
          description="Optimizing the connection between skilled volunteers and tech-for-good projects"
        />
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
