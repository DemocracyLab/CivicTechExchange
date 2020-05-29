// @flow

import React from "react";
import hereApi from "../../utils/hereApi.js";
import type {HereGeocodeResponse, HereAutocompleteResponse, HereSuggestion} from "../../types/HereTypes.jsx";
import Selector from "../selection/Selector.jsx";
import {getLocationInfoFromGeocodeResponse, LocationInfo} from "./LocationInfo.js";
import {CountryData, countryByCode} from "../../constants/Countries.js";

type Props = {|
  id: ?string,
  countryCode: ?string,
  onSelect: (LocationInfo) => null
|};

type State = {|
  isLoading: boolean,
  countryCode: ?string,
  suggestions: $ReadOnlyArray<HereSuggestion>,
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
    if(nextProps.countryCode !== this.state.countryCode) {
      this.setState({countryCode: this.ensureCountryCodeFormat(nextProps.countryCode)}, this.updateAutocompleteOptions);
    }
  }
  
  onInputChange(inputValue: string): void {
    this.updateAutocompleteOptions(inputValue);
  }
  
  ensureCountryCodeFormat(code: string) {
    const country: CountryData = countryByCode(code);
    return country && country.ISO_3;
  }
  
  updateAutocompleteOptions(inputValue: string): void {
    if(inputValue && inputValue.length > 1) {
      this.setState({isLoading: true}, () => {
        hereApi.autocompleteRequest({query: inputValue, country: this.state.countryCode}, (response: HereAutocompleteResponse) => {
          this.setState({isLoading: false, suggestions: response.suggestions});
        });
      });
    }
  }

  // TODO: Move text parsing to helpers and unit test
  getSuggestionOption(suggestion: HereSuggestion): string {
    return suggestion.label;
  }
  
  onOptionSelect(suggestion: HereSuggestion): void {
    hereApi.geocodeRequest({locationId: suggestion.locationId}, this.loadSelectionGeocode.bind(this));
  }
  
  loadSelectionGeocode(response: HereGeocodeResponse): void {
    const locationInfo: LocationInfo = getLocationInfoFromGeocodeResponse(response);
    this.setState({geocodeResponse: response}, () => this.props.onSelect(locationInfo));
  }

  render(): ?React$Node {
    return hereApi.isConfigured()
      ? (
        <Selector
          id={this.props.id || "location-here"}
          options={this.state.suggestions}
          labelGenerator={this.getSuggestionOption}
          valueStringGenerator={(suggestion: HereSuggestion) => suggestion.locationId}
          isMultiSelect={false}
          isClearable={true}
          isSearchable={true}
          onSelection={this.onOptionSelect.bind(this)}
          onInputChange={this.onInputChange.bind(this)}
        />
      )
      : null;
  }
}

export default LocationAutocomplete;