// @flow

import React from "react";
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import { LocationRadius } from "../../stores/ProjectSearchStore.js";
import CloseablePill from "../FindProjects/CloseablePill.jsx";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import GroupSearchDispatcher from "../../stores/GroupSearchDispatcher.js";
import ProjectTagContainer from "../FindProjects/ProjectTagContainer.jsx";
import GroupSearchStore from "../../stores/GroupSearchStore.js";

type PillConfig = {|
  label: string,
  closeAction: () => void,
|};

type State = {|
  pillConfigs: $ReadOnlyArray<PillConfig>,
|};

// TODO: Refactor into shared component between Project and Group search pages
class GroupTagContainer extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [GroupSearchStore];
  }

  static calculateState(prevState: State): State {
    let pillConfigs: Array<PillConfig> = [];
    pillConfigs = pillConfigs.concat(
      GroupSearchStore.getSelectedTags()
        .toJS()
        .map((tag: TagDefinition) => {
          return {
            label: tag.display_name,
            closeAction: () =>
              GroupSearchDispatcher.dispatch({ type: "REMOVE_TAG", tag: tag }),
          };
        })
    );

    const locationRadius: LocationRadius = GroupSearchStore.getLocation();
    if (locationRadius && locationRadius.latitude && locationRadius.longitude) {
      pillConfigs.push({
        label: ProjectTagContainer.getLocationPillLabel(locationRadius),
        closeAction: () =>
          GroupSearchDispatcher.dispatch({
            type: "SET_LOCATION",
            locationRadius: null,
          }),
      });
    }

    return {
      pillConfigs: pillConfigs,
    };
  }

  render(): React$Node {
    return (
      <div className="ProjectTagContainer-root">
        {this.state.pillConfigs.map((pillConfig: PillConfig) => {
          return (
            <CloseablePill
              key={pillConfig.label}
              label={pillConfig.label}
              closeAction={pillConfig.closeAction}
            />
          );
        })}
      </div>
    );
  }
}

export default Container.create(GroupTagContainer);
