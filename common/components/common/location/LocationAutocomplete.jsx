// @flow

import React from "react";
import hereApi from "../../utils/hereApi.js";
import type {
  HereGeocodeResponse,
  HereAutocompleteResponse,
  HereSuggestion,
} from "../../types/HereTypes.jsx";
import Selector from "../selection/Selector.jsx";
import {
  LocationInfo,
  getLocationInfoFromGeocodeResponse,
  getLocationDisplayString,
} from "./LocationInfo.js";
import { CountryData, countryByCode } from "../../constants/Countries.js";

type Props = {|
  id: ?string,
  countryCode: ?string,
  onSelect: LocationInfo => null,
  selected: ?LocationInfo,
|};

type State = {|
  isLoading: boolean,
  countryCode: ?string,
  suggestions: $ReadOnlyArray<HereSuggestion>,
  autocompleteResponse: ?HereAutocompleteResponse,
  geocodeResponse: ?HereGeocodeResponse,
  selected: ?LocationInfo,
|};

export class LocationAutocomplete extends React.Component<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      isLoading: false,
      countryCode:
        props.countryCode && this.ensureCountryCodeFormat(props.countryCode),
      selected: props.selected,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (!_.isEqual(nextProps, this.props)) {
      this.setState(
        {
          countryCode: this.ensureCountryCodeFormat(nextProps.countryCode),
          selected: nextProps.selected,
        },
        this.updateAutocompleteOptions
      );
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
    if (inputValue && inputValue.length > 1) {
      this.setState({ isLoading: true }, () => {
        hereApi.autocompleteRequest(
          { query: inputValue, country: this.state.countryCode },
          (response: HereAutocompleteResponse) => {
            this.setState({
              isLoading: false,
              suggestions: this.filterAutocompleteSuggestions(
                response.suggestions
              ),
            });
          }
        );
      });
    }
  }

  filterAutocompleteSuggestions(
    suggestions: $ReadOnlyArray<HereSuggestion>
  ): $ReadOnlyArray<HereSuggestion> {
    // Only show suggestions that have a city and/or zip code component
    return suggestions.filter(
      (suggestion: HereSuggestion) =>
        suggestion.address.city || suggestion.address.postalCode
    );
  }

  // TODO: Move text parsing to helpers and unit test
  getSuggestionOption(suggestion: HereSuggestion | LocationInfo): string {
    if (!suggestion) {
      return null;
    } else if (suggestion.country) {
      // LocationInfo placeholder case
      return getLocationDisplayString(suggestion);
    } else if (suggestion.label) {
      // HERE label returns broad to specific, switch that to show specific to broad
      return suggestion["label"]
        .split(",")
        .reverse()
        .join(", ");
    } else {
      return suggestion.location_id;
    }
  }

  onOptionSelect(suggestion: ?HereSuggestion): void {
    if (suggestion) {
      hereApi.geocodeRequest(
        { locationId: suggestion.locationId },
        this.loadSelectionGeocode.bind(this)
      );
    } else {
      this.setState({ selected: null }, () => this.props.onSelect(null));
    }
  }

  loadSelectionGeocode(response: HereGeocodeResponse): void {
    const locationInfo: LocationInfo = getLocationInfoFromGeocodeResponse(
      response
    );
    this.setState(
      {
        geocodeResponse: response,
        selected: locationInfo,
      },
      () => this.props.onSelect(locationInfo)
    );
  }

  render(): ?React$Node {
    return hereApi.isConfigured() ? (
      <Selector
        id={this.props.id || "location-here"}
        options={this.state.suggestions}
        selected={this.state.selected}
        placeholder="Address, city, or zip"
        noOptionsMessage="Start typing location"
        labelGenerator={this.getSuggestionOption}
        valueStringGenerator={(suggestion: HereSuggestion | LocationInfo) =>
          suggestion.locationId || suggestion.location_id
        }
        isMultiSelect={false}
        isClearable={true}
        isSearchable={true}
        onSelection={this.onOptionSelect.bind(this)}
        onInputChange={this.onInputChange.bind(this)}
      />
    ) : null;
  }
}

export default LocationAutocomplete;
