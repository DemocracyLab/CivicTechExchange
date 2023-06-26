// @flow
// derived from AboutGroupDisplay
import React from "react";
import type { FluxReduceStore } from "flux/utils";
import _ from "lodash";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { Container } from "flux/utils";
import EntitySearchStore, {
  SearchFor,
} from "../../stores/EntitySearchStore.js";
import ProjectCardsContainer from "../../componentsBySection/FindProjects/ProjectCardsContainer.jsx";

type Props = {|
  group: ?GroupDetailsAPIData,
  viewOnly: boolean,
|};

type State = {|
  group: ?GroupDetailsAPIData,
  approvedProjects: $ReadOnlyArray<ProjectRelationshipAPIData>,
  issueAreas: $ReadOnlyArray<TagDefinition>,
  showJoinModal: boolean,
|};

class AboutGroupDisplay extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = { group: props.group };
    this.initProjectSearch(this.state);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    return Object.assign(prevState || {})
  }

  render(): React$Node {
    const group: GroupDetailsAPIData = this.state.group;
    return (
      <div className="Profile-primary-section col-12 col-lg-auto flex-lg-shrink-1">
        <div className="Profile-primary-container frame-full">
          {group.group_project_count > 0 && (
            <div className="AboutGroup-card-container">
              <div className="row">
                <ProjectCardsContainer
                  showSearchControls={false}
                  supressHeader={true}
                  staticHeaderText=""
                  fullWidth={true}
                  selectableCards={false}
                  handleEmptyProject={() => {}}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  initProjectSearch(state: State) {
    const group: GroupDetailsAPIData = state.group;
    if (group) {
      UniversalDispatcher.dispatch({
        type: "INIT_SEARCH",
        findProjectsArgs: {
          group_id: group.group_id,
          sortField: "-project_date_modified",
        },
        searchSettings: {
          updateUrl: false,
          searchConfig: SearchFor.Projects,
        },
      });
    }
  }
}

export default Container.create(AboutGroupDisplay, { pure: false });
