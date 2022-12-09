// @flow

import React from "react";
import { Container } from "flux/utils";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { LocationTimezone } from "../../utils/EventAPIUtils.js";
import Selector from "../selection/Selector.jsx";
import _ from "lodash";

type Props = {|
  elementId: string,
  location_timezones: $ReadOnlyArray<LocationTimezone>,
  show_timezone: boolean,
  value: ?LocationTimezone,
  onSelection: LocationTimezone => void,
  useFormFieldsStore: Boolean,
|};
type State = {|
  value: LocationTimezone,
|};

const displayTimezone: LocationTimezone => string = (tz: LocationTimezone) =>
  tz.time_zone;
const displayLocation: LocationTimezone => string = (tz: LocationTimezone) => {
  if (tz.location_name) {
    return tz.location_name;
  } else {
    return `${tz.city}, ${tz.country}`;
  }
};

/**
 * Dropdown selector for location/time zone
 */
class LocationTimezoneSelector extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      value: LocationTimezoneSelector.getSelected(props),
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.value = LocationTimezoneSelector.getSelected(props);
    return state;
  }

  static getSelected(props: Props): LocationTimezone {
    return props.useFormFieldsStore
      ? FormFieldsStore.getFormFieldValue(props.elementId)
      : props.value;
  }

  // pushUpdates(tags: $ReadOnlyArray<TagDefinition>): void {
  //   this.props.onSelection && this.props.onSelection(tags);
  //   if (this.props.useFormFieldsStore) {
  //     UniversalDispatcher.dispatch({
  //       type: "UPDATE_FORM_FIELD",
  //       fieldName: this.props.elementId,
  //       fieldValue: tags,
  //     });
  //   }
  // }

  // TODO: Replace with Selector component
  render(): React$Node {
    return (
      <React.Fragment>
        <Selector
          id={this.props.elementId || "location_timezone"}
          isSearchable={true}
          isClearable={false}
          isMultiSelect={false}
          options={this.props.location_timezones}
          labelGenerator={
            this.props.show_timezone ? displayTimezone : displayLocation
          }
          valueStringGenerator={(tz: LocationTimezone) => tz.id}
          selected={this.state.value}
          onSelection={this.props.onSelection}
        />
      </React.Fragment>
    );
  }
}

export default Container.create(LocationTimezoneSelector, { withProps: true });
