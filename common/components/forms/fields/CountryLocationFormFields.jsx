// @flow

import React from "react";
import { Container } from "flux/utils";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { CountrySelector } from "../../common/selection/CountrySelector.jsx";
import { CountryCodeFormats, CountryData } from "../../constants/Countries.js";
import {
  LocationAutocompleteForm,
  LocationFormInputsByEntity,
} from "../LocationAutocompleteForm.jsx";
import { LocationInfo } from "../../common/location/LocationInfo.js";
import _ from "lodash";

type Props = {|
  locationFormInputs: LocationFormInputsByEntity,
  countryFieldId: string,
  locationFieldId: string,
|};

type State = {|
  country: CountryData,
  location: LocationInfo,
|};

// Wrapper for combined country/location form fields
class CountryLocationFormFields extends React.Component<Props, State> {
  constructor(props: Props): void {
    super();
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.country = FormFieldsStore.getFormFieldValue(props.countryFieldId);
    state.location = FormFieldsStore.getFormFieldValue(props.locationFieldId);
    return state;
  }

  onSelection(fieldName: string, value: CountryData | LocationInfo) {
    UniversalDispatcher.dispatch({
      type: "UPDATE_FORM_FIELD",
      fieldName: fieldName,
      fieldValue: value,
    });
  }

  render(): ?React$Node {
    return (
      <React.Fragment>
        <div className="form-group">
          <label>Country</label>
          <CountrySelector
            id={this.props.countryFieldId}
            countryCode={this.state.country?.ISO_2}
            countryCodeFormat={CountryCodeFormats.ISO_2}
            onSelection={(country: CountryData) => {
              this.onSelection(this.props.countryFieldId, country);
              this.onSelection(this.props.locationFieldId, null);
            }}
          />

        </div>

        <div className="form-group">
          <label>Location</label>
          <LocationAutocompleteForm
            country={this.state.country}
            onSelect={this.onSelection.bind(this, this.props.locationFieldId)}
            location={this.state.location}
            formInputs={this.props.locationFormInputs}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Container.create(CountryLocationFormFields, { withProps: true });
