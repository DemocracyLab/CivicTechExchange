// @flow

import ProjectSearchDispatcher from "../stores/ProjectSearchDispatcher.js";
import TagDispatcher from "../stores/TagDispatcher.js";
import FindProjectCardsContainer from "../componentsBySection/FindProjects/FindProjectCardsContainer.jsx";
import ProjectSearchFilterContainer from "../componentsBySection/FindProjects/ProjectSearchFilterContainer.jsx";
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
    ]);
    if (!args.sortField) {
      args.sortField = "-project_date_modified";
    }
    ProjectSearchDispatcher.dispatch({
      type: "INIT",
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
          <div className="row FindProjectsController-top">
            <div className="col-12 FindProjectsController-title">
              <h1>Find Projects</h1>
            </div>
            <ProjectSearchFilterContainer />
          </div>
          <div className="row">
            <FindProjectCardsContainer rowMaximum={3} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FindProjectsController;
