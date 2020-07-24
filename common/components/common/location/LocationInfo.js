// @flow
import type {HereGeocodeResponse, HereGeocodeResponseAddress, HereGeocodeResponseLocation} from "../../utils/hereApi.js";
import _ from "lodash";
import type {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import type {GroupDetailsAPIData} from "../../utils/GroupAPIUtils.js";
import {countryByCode, DefaultCountry, CountryData} from "../../constants/Countries.js";

export type LocationInfo = {|
  city: string,
  country: string,
  latitude: number,
  longitude: number,
  location_id: string,
  state: string
|};

export function getLocationDisplayString(location: LocationInfo) {
  const country: CountryData = countryByCode(location.country);
  if(country === DefaultCountry) {
    // US format
    return _.compact([location.city, location.state, country.ISO_3]).join(", ");
  } else if (country) {
    // International format
    return _.compact([location.city, country.displayName]).join(", ");
  } else if (location.latitude && location.longitude) {
    // Case where we just have latitude/longitude
    return location.latitude + "," + location.longitude;
  } else {
    return location.location_id;
  }
}

export function getLocationInfoFromGeocodeResponse(geocodeResponse:HereGeocodeResponse): ?LocationInfo {
  const geoCodeLocation: HereGeocodeResponseLocation = _.get(geocodeResponse, "Response.View[0].Result[0].Location");
  return geoCodeLocation && {
    latitude: geoCodeLocation.DisplayPosition.Latitude,
    longitude: geoCodeLocation.DisplayPosition.Longitude,
    location_id: geoCodeLocation.LocationId,
    city: geoCodeLocation.Address.City,
    country: geoCodeLocation.Address.Country,
    state: geoCodeLocation.Address.State
  };
}

export function getLocationInfoFromProject(project: ProjectDetailsAPIData): ?LocationInfo {
  return project && project.project_location && {
    location_id: project.project_location,
    city: project.project_city,
    country: project.project_country,
    state: project.project_state
  };
}

export function getLocationInfoFromGroup(group: GroupDetailsAPIData): ?LocationInfo {
  return group && group.group_location && {
    location_id: group.group_location,
    city: group.group_city,
    country: group.group_country,
    state: group.group_state
  };
}