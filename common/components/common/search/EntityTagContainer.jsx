// @flow

import React from "react";
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import EntitySearchStore from "../../stores/EntitySearchStore.js";
import type { LocationRadius } from "../location/LocationRadius.js";
import CloseablePill from "../../componentsBySection/FindProjects/CloseablePill.jsx";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { getLocationDisplayString } from "../location/LocationInfo.js";

type PillConfig = {|
  label: string,
  closeAction: () => void,
|};

type State = {|
  pillConfigs: $ReadOnlyArray<PillConfig>,
|};

class EntityTagContainer extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    let pillConfigs: Array<PillConfig> = [];

    if (EntitySearchStore.getFavoritesOnly()) {
      pillConfigs.push({
        label: "Favorites Only",
        closeAction: () =>
          UniversalDispatcher.dispatch({
            type: "SET_FAVORITES_ONLY",
            favoritesOnly: false,
          }),
      });
    }

    pillConfigs = pillConfigs.concat(
      EntitySearchStore.getTags()
        .toJS()
        .map((tag: TagDefinition) => {
          return {
            label: tag.display_name,
            closeAction: () =>
              UniversalDispatcher.dispatch({
                type: "REMOVE_TAG",
                tag: tag,
              }),
          };
        })
    );

    const locationRadius: LocationRadius = EntitySearchStore.getLocation();
    if (locationRadius && locationRadius.latitude && locationRadius.longitude) {
      pillConfigs.push({
        label: EntityTagContainer.getLocationPillLabel(locationRadius),
        closeAction: () =>
          UniversalDispatcher.dispatch({
            type: "SET_LOCATION",
            locationRadius: null,
          }),
      });
    }

    const legacyLocation: string = EntitySearchStore.getLegacyLocation();
    if (legacyLocation) {
      pillConfigs.push({
        label: "In: " + decodeURI(legacyLocation),
        closeAction: () =>
          UniversalDispatcher.dispatch({ type: "UNSET_LEGACY_LOCATION" }),
      });
    }

    return {
      pillConfigs: pillConfigs,
    };
  }

  static getLocationPillLabel(locationRadius: LocationRadius): string {
    let label: string = "Near: ";
    if (locationRadius.metadata) {
      label += getLocationDisplayString(locationRadius.metadata);
    } else {
      label += locationRadius.latitude + "," + locationRadius.longitude;
    }

    return label;
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

export default Container.create(EntityTagContainer);
