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
import TagCategory from "../../common/tags/TagCategory.jsx";

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
    console.log("========= calculateState =========")
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

  _formatOutput(tag_category: TagCategory): string {
    let tag_list = this.state.tags
                          .toJS()
                          .filter((tag: TagDefinition) => 
                            tag.category === tag_category
                          ).map(({tag_name}) => ({tag_name}));
    let string = ''
    tag_list.forEach(item => string += item.tag_name + ",");
    return string.replace(/,*$/, '');
  }

  _enableAlert(): void {
    // UniversalDispatcher.dispatch({
    //   type: "ENABLE_ALERT",
    // });
      this.state.tags
      .toJS()
      .map((tag: TagDefinition) => {
        return {
          label: tag.display_name,
          tag_name: tag.tag_name,
          id: tag.id,
          category: tag.category,
          subcategory: tag.subcategory,
          parent: tag.parent,
        };
      })
    )
    ProjectAPIUtils.post(
      "/alert/create",
      {
        "email": "test3@gmail.com", // qqq: delete
        "filters":
          {
            "alert_issue_area": "civic-infrastructure,education",
            "alert_technologies": "joomla",
            "alert_role": "project-manager",
            "alert_organization_type": "nonprofit",
            "alert_stage": "ideation-stage",
          },
        "country": "EN",
        "postal_code": 94085,
        "alert_issue_area": this._formatOutput(TagCategory.ISSUES),
        "alert_technologies": this._formatOutput(TagCategory.TECHNOLOGIES_USED),
        "alert_role": this._formatOutput(TagCategory.ROLE),
        "alert_organization_type": this._formatOutput(TagCategory.ORGANIZATION_TYPE),
        "alert_stage":  this._formatOutput(TagCategory.PROJECT_STAGE),
      }
      ,
      response => null /* TODO: Report error to user */
    )

  }
}

export default Container.create(EnableAlertButton);
