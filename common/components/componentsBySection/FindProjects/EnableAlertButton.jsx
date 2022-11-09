// @flow
import type { FluxReduceStore } from "flux/utils";
import { List } from "immutable";
import { Container } from "flux/utils";
import EntitySearchStore from "../../stores/EntitySearchStore.js";
import type { LocationRadius } from "../../common/location/LocationRadius.js";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import React from "react";
import _ from "lodash";

type State = {|
  keyword: string,
  tags: List<TagDefinition>,
  defaultSort: string,
  sortField: string,
  location: string,
  locationRadius: LocationRadius,
  favoritesOnly: boolean,
|};

class EnableAlertButton extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      keyword: EntitySearchStore.getKeyword() || "",
      tags: EntitySearchStore.getTags() || [],
      defaultSort: EntitySearchStore.getDefaultSortField() || "",
      sortField: EntitySearchStore.getSortField() || "",
      location: EntitySearchStore.getLegacyLocation() || "",
      locationRadius: EntitySearchStore.getLocation() || {},
      favoritesOnly: EntitySearchStore.getFavoritesOnly(),
    };
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <button
          className="btn btn-primary btn-block enable-alert-button"
          disabled={
            !(
              this.state.keyword ||
              this.state.tags.size > 0 ||
              this.state.sortField !== this.state.defaultSort ||
              this.state.location ||
              !_.isEmpty(this.state.locationRadius) ||
              this.state.favoritesOnly
            )
          }
          onClick={this._enableAlert.bind(this)}
        >
          Enable Alert
        </button>
      </React.Fragment>
    );
  }
  _enableAlert(): void {
    // UniversalDispatcher.dispatch({
    //   type: "ENABLE_ALERT",
    // });
    console.log("========= enable alerts =========")
    ProjectAPIUtils.post(
      "/alert/create",
      {
        "email": "test3@gmail.com",
        "filters":
        {
          "alert_issue_area": "civic-infrastructure,education",
          "alert_technologies": "joomla",
          "alert_role": "project-manager",
          "alert_organization_type": "nonprofit",
          "alert_stage": "ideation-stage",
        },
      }
      ,
      response => null /* TODO: Report error to user */
    )
  }
}

export default Container.create(EnableAlertButton);
