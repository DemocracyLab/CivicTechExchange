// @flow

import React from "react";
import Select from "react-select";
import hereApi from "../../utils/hereApi.js";
import type {HereGeocodeResponse, HereAutocompleteResponse, HereSuggestion} from "../../utils/hereApi.js";
import type {SelectOption} from "../../types/SelectOption.jsx";
import {getLocationInfoFromGeocodeResponse, LocationInfo} from "./LocationInfo.js";

type Props = {|
  onSelect: (LocationInfo) => null
|};

type State = {|
  isLoading: boolean,
  suggestions: $ReadOnlyArray<SelectOption>,
  autocompleteResponse: ?HereAutocompleteResponse,
  geocodeResponse: ?HereGeocodeResponse
|};

export class LocationAutocomplete extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    // TODO: Support existing value
  }
  
  onInputChange(inputValue: string): void {
    this.updateAutocompleteOptions(inputValue);
  }
  
  updateAutocompleteOptions(inputValue: string): void {
    if(inputValue && inputValue.length > 1) {
      this.setState({isLoading: true}, () => {
        hereApi.autocompleteRequest({query: inputValue}, (response: HereAutocompleteResponse) => {
          this.setState({isLoading: false, suggestions: this.getAutocompleteOptions(response)});
        });
      });
    }
  }
  
  getAutocompleteOptions(response: HereAutocompleteResponse): void {
    // Populate list of options
    const suggestionOptions = response.suggestions.map(this.getSuggestionOption.bind(this));
    return suggestionOptions;
  }
  
  // TODO: Move text parsing to helpers and unit test
  getSuggestionOption(suggestion: HereSuggestion): SelectOption {
    const fields = ["city", "county", "state", "country"];
    console.log(JSON.stringify(suggestion));
    let address = suggestion.address;
    const parts = fields.map(field => address[field] ? [address[field], field] : null).filter(entry => !!entry);
    const partsByName = _.groupBy(parts, part => part[0]);
    _.values(partsByName).filter(parts => parts.length > 1).forEach(group => group.forEach(entry => {
      console.log(entry);
      entry[0] = entry[0] + " (" + _.capitalize(entry[1]) + ")";
    }));
    let addressPart = address.houseNumber && address.street ? address.houseNumber + " " + address.street + ", " : "";
    return {
      value: suggestion.locationId,
      label: addressPart + parts.map(part => part[0]).join(", ")
    };
  }
  
  onOptionSelect(selection: SelectOption): void {
    console.log(JSON.stringify(selection));
    hereApi.geocodeRequest({locationId: selection.value}, this.loadSelectionGeocode.bind(this));
  }
  
  loadSelectionGeocode(response: HereGeocodeResponse): void {
    const locationInfo: LocationInfo = getLocationInfoFromGeocodeResponse(response);
    this.setState({geocodeResponse: response}, () => this.props.onSelect(locationInfo));
  }

  render(): ?React$Node {
    return hereApi.isConfigured()
    ? (
      <Select
        id="location-here"
        name="location-here"
        options={this.state.suggestions}
        // value={this.state.selectedCountry}
        onInputChange={this.onInputChange.bind(this)}
        onChange={this.onOptionSelect.bind(this)}
        simpleValue={false}
        clearable={false}
        multi={false}
      />
    )
    : null;
  }
}

export default LocationAutocomplete;