// @flow

import React from "react";
import { LocationInfo } from "../common/location/LocationInfo.js";
import { CountryData } from "../constants/Countries.js";
import type { Dictionary } from "../types/Generics.jsx";
import HiddenFormFields from "./HiddenFormFields.jsx";
import LocationAutocomplete from "../common/location/LocationAutocomplete.jsx";
import _ from "lodash";

export const LocationFormInputsByEntity: Dictionary<
  (LocationInfo) => string
> = {
  Projects: {
    project_location: (location: LocationInfo) =>
      location ? location.location_id : "",
    project_state: (location: LocationInfo) => (location ? location.state : ""),
    project_city: (location: LocationInfo) => (location ? location.city : ""),
    project_latitude: (location: LocationInfo) =>
      location ? location.latitude : "",
    project_longitude: (location: LocationInfo) =>
      location ? location.longitude : "",
  },
  Groups: {
    group_location: (location: LocationInfo) =>
      location ? location.location_id : "",
    group_state: (location: LocationInfo) => (location ? location.state : ""),
    group_city: (location: LocationInfo) => (location ? location.city : ""),
    group_latitude: (location: LocationInfo) =>
      location ? location.latitude : "",
    group_longitude: (location: LocationInfo) =>
      location ? location.longitude : "",
  },
};

type Props = {|
  location: ?LocationInfo,
  country: ?CountryData,
  formInputs: Dictionary<(LocationInfo) => string>,
  onSelect: LocationInfo => null,
|};

type State = {|
  location: ?LocationInfo,
|};

export class LocationAutocompleteForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      location: props.location,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    if (!_.isEqual(nextProps.location, this.state.location)) {
      return { location: nextProps.location };
    }
    return null;
  }

  onOptionSelect(location: LocationInfo): void {
    this.setState({ location: location }, () => this.props.onSelect(location));
  }

  render(): ?React$Node {
    // TODO: Insert placeholder into LocationAutocomplete
    return (
      <React.Fragment>
        <HiddenFormFields
          sourceObject={this.state.location}
          fields={this.props.formInputs || LocationFormInputsByEntity.Projects}
        />
        <LocationAutocomplete
          countryCode={this.props.country && this.props.country.ISO_3}
          onSelect={this.onOptionSelect.bind(this)}
          selected={this.state.location}
        />
      </React.Fragment>
    );
  }
}

export default LocationAutocompleteForm;
