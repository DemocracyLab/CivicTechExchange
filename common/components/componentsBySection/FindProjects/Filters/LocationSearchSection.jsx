// @flow
import React from "react";
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import EntitySearchStore from "../../../stores/EntitySearchStore.js";
import type { LocationRadius } from "../../../common/location/LocationRadius.js";
import UniversalDispatcher from "../../../stores/UniversalDispatcher.js";
import LocationAutocomplete from "../../../common/location/LocationAutocomplete.jsx";
import type { LocationInfo } from "../../../common/location/LocationInfo";
import Selector from "../../../common/selection/Selector.jsx";
import { CountrySelector } from "../../../common/selection/CountrySelector.jsx";
import {
  CountryCodeFormats,
  CountryData,
  DefaultCountry,
} from "../../../constants/Countries.js";
import GlyphStyles from "../../../utils/glyphs.js";

type State = {|
  countryCode: string,
  countryOptions: $ReadOnlyArray<CountryData>,
  locationRadius: LocationRadius,
  locationPlaceholder: ?LocationInfo,
  locationInfo: LocationInfo,
  searchRadius: number,
  locationExpanded: boolean,
|};

//define CSS classes as consts for toggling, same as RenderFilterCategory.jsx
const classCategoryExpanded =
  "ProjectFilterContainer-category ProjectFilterContainer-expanded";
const classCategoryCollapsed =
  "ProjectFilterContainer-category ProjectFilterContainer-collapsed";
const classSubcategoryExpanded =
  "ProjectFilterContainer-subcategory ProjectFilterContainer-expanded";
const classSubcategoryCollapsed =
  "ProjectFilterContainer-subcategory ProjectFilterContainer-collapsed";

const DefaultSearchRadius: number = 50;

class LocationSearchSection extends React.Component<{||}, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      searchRadius: DefaultSearchRadius,
      countryCode: DefaultCountry.ISO_3,
      locationExpanded: false,
    };

    this.updateLocationState = this.updateLocationState.bind(this);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [EntitySearchStore];
  }

  static calculateState(prevState: State): State {
    const state: State = {
      countryOptions: EntitySearchStore.getCountryList(),
    };
    state.locationRadius = EntitySearchStore.getLocation() || {};
    if (
      !_.isEmpty(state.locationRadius) &&
      (!prevState || !prevState.locationInfo)
    ) {
      // Placeholder lat/long location in Near field
      state.countryCode = null;
      state.locationInfo = {
        latitude: state.locationRadius.latitude,
        longitude: state.locationRadius.longitude,
      };
      state.searchRadius = state.locationRadius.radius;
    } else if (_.isEmpty(state.locationRadius)) {
      // If filters were cleared
      state.locationInfo = null;
    }

    return state;
  }

  //handle expand/collapse
  _handleExpand(event) {
    this.setState(prevState => ({
      locationExpanded: !prevState.locationExpanded,
    }));
  }

  updateLocationState(
    locationInfo: ?LocationInfo,
    searchRadius: ?number
  ): void {
    if (searchRadius && !_.isEmpty(locationInfo)) {
      // Case: Setting new location state filter
      const locationRadius: LocationRadius = {
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude,
        radius: searchRadius,
        metadata: locationInfo,
      };
      if (!_.isEqual(locationRadius, this.state.locationRadius)) {
        this.setState({ locationInfo: locationInfo }, () => {
          UniversalDispatcher.dispatch({
            type: "SET_LOCATION",
            locationRadius: locationRadius,
          });
        });
      }
    } else if (!_.isEmpty(this.state.locationRadius)) {
      // Case: Clearing location state filter after clearing Near box
      this.setState({ locationRadius: null }, () => {
        UniversalDispatcher.dispatch({
          type: "SET_LOCATION",
          locationRadius: null,
        });
      });
    }
  }

  onCountrySelect(country: CountryData): void {
    if (this.state.countryCode !== country.ISO_3) {
      this.setState({ countryCode: country.ISO_3 });
    }
  }

  onLocationSelect(locationInfo: LocationInfo): void {
    if (
      !this.state.locationInfo ||
      !locationInfo ||
      this.state.locationInfo !== locationInfo.location_id
    ) {
      this.updateLocationState(locationInfo, this.state.searchRadius);
    }
  }

  onRadiusSelect(searchRadius: number): void {
    if (!this.state.searchRadius || this.state.searchRadius !== searchRadius) {
      this.setState({ searchRadius: searchRadius }, () =>
        this.updateLocationState(this.state.locationInfo, searchRadius)
      );
    }
  }

  _renderSelector(): React$Node {
    return (
      <React.Fragment>
        <label>Country(Required)</label>
        <CountrySelector
          countryCode={this.state.countryCode}
          countryOptions={this.state.countryOptions}
          countryCodeFormat={CountryCodeFormats.ISO_3}
          onSelection={this.onCountrySelect.bind(this)}
        />

        <label>Near</label>
        <LocationAutocomplete
          countryCode={this.state.countryCode}
          onSelect={this.onLocationSelect.bind(this)}
          selected={this.state.locationInfo}
        />

        <label>Distance</label>
        <Selector
          id="radius"
          isSearchable={false}
          isClearable={false}
          isMultiSelect={false}
          options={[5, 10, 25, 50, 100, 200]}
          labelGenerator={num => num + " Miles"}
          selected={this.state.searchRadius || DefaultSearchRadius}
          onSelection={this.onRadiusSelect.bind(this)}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="LocationSearchContainer">
        <div
          className={
            this.state.locationExpanded
              ? classCategoryExpanded
              : classCategoryCollapsed
          }
        >
          <div
            className="ProjectFilterContainer-category-header"
            id="location-search-section"
            onClick={e => this._handleExpand(e)}
          >
            <span>Location</span>
            <span className="ProjectFilterContainer-showtext">
              {this.state.locationExpanded ? (
                <i className={GlyphStyles.ChevronUp}></i>
              ) : (
                <i className={GlyphStyles.ChevronDown}></i>
              )}
            </span>
          </div>
          <div className="ProjectFilterContainer-content LocationSearchContainer-content">
            {this._renderSelector()}
          </div>
        </div>
      </div>
    );
  }
}

export default Container.create(LocationSearchSection);
