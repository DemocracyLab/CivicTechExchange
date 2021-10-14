// @flow
import React, { forwardRef } from "react";
import type { FluxReduceStore } from "flux/utils";
import { Container } from "flux/utils";
import ProjectSearchStore, {
  LocationRadius,
} from "../../../stores/ProjectSearchStore.js";
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
import Dropdown from "react-bootstrap/Dropdown";
import PopOut from "../../../common/popout/PopOut.jsx";

type State = {|
  isOpen: boolean,
  countryCode: string,
  countryOptions: $ReadOnlyArray<CountryData>,
  locationRadius: LocationRadius,
  locationPlaceholder: ?LocationInfo,
  locationInfo: LocationInfo,
  searchRadius: number,
  locationExpanded: boolean,
|};

const DefaultSearchRadius: number = 50;

class LocationSearchSection extends React.Component<{||}, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      searchRadius: DefaultSearchRadius,
      countryCode: DefaultCountry.ISO_3,
      locationExpanded: false,
      isOpen: false,
    };

    this.updateLocationState = this.updateLocationState.bind(this);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    const state: State = {
      countryOptions: ProjectSearchStore.getCountryList(),
    };
    state.locationRadius = ProjectSearchStore.getLocation() || {};
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

  _renderSelector(ref): React$Node {
    return (
      <div className="RenderFilterPopout" ref={ref}>
        <div className="SubCategoryFrame">
          <Dropdown.Item className="LocationSearchSection-container">
            <label>Country(Required)</label>
            <div className="LocationSearchSection-selector">
              <CountrySelector
                countryCode={this.state.countryCode}
                countryOptions={this.state.countryOptions}
                countryCodeFormat={CountryCodeFormats.ISO_3}
                onSelection={this.onCountrySelect.bind(this)}
              />
            </div>

            <label>Near</label>
            <div className="LocationSearchSection-selector">
              <LocationAutocomplete
                countryCode={this.state.countryCode}
                onSelect={this.onLocationSelect.bind(this)}
                selected={this.state.locationInfo}
              />
            </div>

            <label>Distance</label>
            <div className="LocationSearchSection-selector">
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
            </div>
          </Dropdown.Item>
        </div>
      </div>
    );
  }

  toggleCategory() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  hideCategory() {
    this.setState({ isOpen: false });
  }

  render(): React$Node {
    const frameContentFunc: forwardRef = (props, ref) => {
      return this._renderSelector(ref);
    };

    const sourceRef: forwardRef = React.createRef();

    return (
      <div
        className="btn btn-outline-secondary"
        id="Location"
        ref={this.targetRef}
      >
        <div
          className="DoWeNeedThis"
          ref={sourceRef}
          onClick={this.toggleCategory.bind(this)}
        >
          Location <span className="RenderFilterCategory-activecount"></span>
          <span className="RenderFilterCategory-arrow">
            <i className={GlyphStyles.ChevronDown}></i>
          </span>
        </div>
        <PopOut
          show={this.state.isOpen}
          frameRef={frameContentFunc}
          sourceRef={sourceRef}
          direction={"bottom"}
          onHide={this.hideCategory.bind(this)}
        />
      </div>
    );
  }
}

export default Container.create(LocationSearchSection);
