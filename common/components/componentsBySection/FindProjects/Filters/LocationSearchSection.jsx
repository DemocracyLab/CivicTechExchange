// @flow
import React from 'react';
import type {FluxReduceStore} from 'flux/utils';
import {Container} from 'flux/utils';
import ProjectSearchStore, {LocationRadius}  from "../../../stores/ProjectSearchStore.js";
import ProjectSearchDispatcher from "../../../stores/ProjectSearchDispatcher.js";
import LocationAutocomplete from "../../../common/location/LocationAutocomplete.jsx";
import type {LocationInfo} from "../../../common/location/LocationInfo";
import Selector from "../../../common/selection/Selector.jsx";
import {CountrySelector} from "../../../common/selection/CountrySelector.jsx";
import {CountryCodeFormats} from "../../../constants/Countries";
import type {CountryData} from "../../../constants/Countries";

type State = {|
  countryCode: string,
  location: LocationRadius,
  locationInfo: LocationInfo,
  searchRadius: number
|};

class LocationSearchSection extends React.Component<{||}, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      searchRadius: 10
    };
  
    this.updateLocationState = this.updateLocationState.bind(this);
  }
  
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      location: ProjectSearchStore.getLocation() || {}
    };
  }
  
  updateLocationState(): void {
    if(this.state.locationInfo && this.state.searchRadius) {
      const locationRadius: LocationRadius = {
        latitude: this.state.locationInfo.latitude,
        longitude: this.state.locationInfo.longitude,
        radius: this.state.searchRadius
      };
      ProjectSearchDispatcher.dispatch({
        type: 'SET_LOCATION',
        location: locationRadius,
      });
    }
  }
  
  onCountrySelect(country: CountryData): void {
    if(this.state.countryCode !== country.ISO_3) {
      this.setState({countryCode: country.ISO_3});
    }
  }
  
  onLocationSelect(locationInfo: LocationInfo): void {
    if(!this.state.locationInfo || this.state.locationInfo !== locationInfo.location_id ) {
      this.setState({locationInfo: locationInfo}, this.updateLocationState);
    }
  }
  
  onRadiusSelect(searchRadius: number): void {
    if(!this.state.searchRadius || this.state.searchRadius !== searchRadius ) {
      this.setState({searchRadius: searchRadius}, this.updateLocationState);
    }
  }

  render(): React$Node {
    return (
      <React.Fragment>
        
        <label>Country(Required)</label>
        <CountrySelector
          countryCodeFormat={CountryCodeFormats.ISO_3}
          onSelection={this.onCountrySelect.bind(this)}
        />
        
        <label>Near</label>
        <LocationAutocomplete
          countryCode={this.state.countryCode}
          onSelect={this.onLocationSelect.bind(this)}
        />
        
        <label>Distance</label>
        <Selector
          id="radius"
          isSearchable={false}
          isClearable={false}
          isMultiSelect={false}
          options={[5,10,25,50,100,200]}
          labelGenerator={(num) => num + " Miles"}
          selected={this.state.searchRadius}
          onSelection={this.onRadiusSelect.bind(this)}
        />
      </React.Fragment>
    );
  }
}

export default Container.create(LocationSearchSection);
