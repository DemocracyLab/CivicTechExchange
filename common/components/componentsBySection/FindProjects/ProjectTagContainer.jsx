// @flow

import type {FluxReduceStore} from 'flux/utils';
import {Container} from 'flux/utils';
import ProjectSearchStore,{LocationRadius} from '../../stores/ProjectSearchStore.js';
import CloseablePill from './CloseablePill.jsx';
import React from 'react';
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";
import ProjectSearchDispatcher from "../../stores/ProjectSearchDispatcher.js";
import {getLocationDisplayString} from "../../common/location/LocationInfo.js";

type PillConfig = {|
  label: string,
  closeAction: () => void
|};

type State = {|
  pillConfigs: $ReadOnlyArray<PillConfig>
|};

class ProjectTagContainer extends React.Component<{||}, State> {

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    let pillConfigs: Array<PillConfig> = [];
    pillConfigs = pillConfigs.concat(ProjectSearchStore.getTags().toJS().map((tag: TagDefinition) => {
      return {
        label: tag.display_name,
        closeAction: () => ProjectSearchDispatcher.dispatch({type: 'REMOVE_TAG', tag: tag})
      };
    }));
    
    const locationRadius: LocationRadius = ProjectSearchStore.getLocation();
    if(locationRadius && locationRadius.latitude && locationRadius.longitude) {
      pillConfigs.push({
        label: ProjectTagContainer.getLocationPillLabel(locationRadius),
        closeAction: () => ProjectSearchDispatcher.dispatch({type: 'SET_LOCATION', locationRadius: null})
      });
    }
  
    const legacyLocation: string = ProjectSearchStore.getLegacyLocation();
    if(legacyLocation) {
      pillConfigs.push({
        label: "In: " + decodeURI(legacyLocation),
        closeAction: () => ProjectSearchDispatcher.dispatch({type: 'UNSET_LEGACY_LOCATION'})
      });
    }
    
    return {
      pillConfigs: pillConfigs
    };
  }
  
  static getLocationPillLabel(locationRadius: LocationRadius): string {
    let label: string = "Near: ";
    if(locationRadius.metadata) {
      label += getLocationDisplayString(locationRadius.metadata);
    } else {
      label += locationRadius.latitude + "," + locationRadius.longitude;
    }
    
    return label;
  }

  render(): React$Node {
    return (
      <div className="ProjectTagContainer-root">
        {
          this.state.pillConfigs.map( (pillConfig: PillConfig) => {
            return (
              <CloseablePill key={pillConfig.label} label={pillConfig.label} closeAction={pillConfig.closeAction}/>
            );
          })
        }
      </div>
    );
  }
}

export default Container.create(ProjectTagContainer);
