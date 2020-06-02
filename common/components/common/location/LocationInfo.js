// @flow
import type {HereGeocodeResponse, HereGeocodeResponseAddress, HereGeocodeResponseLocation} from "../../utils/hereApi.js";
import _ from "lodash";

// TODO: Add data we want to store in database
export type LocationInfo = {|
  latitude: number,
  longitude: number,
  location_id: string,
  name: string
|};

export function getLocationInfoFromGeocodeResponse(geocodeResponse:HereGeocodeResponse): ?LocationInfo {
  const geoCodeLocation: HereGeocodeResponseLocation = _.get(geocodeResponse, "Response.View[0].Result[0].Location");
  return geoCodeLocation && {
    latitude: geoCodeLocation.DisplayPosition.Latitude,
    longitude: geoCodeLocation.DisplayPosition.Longitude,
    location_id: geoCodeLocation.LocationId,
    name: getLocationTextForAddress(geoCodeLocation.Address)
  };
}

// TODO: Unit test
export function getLocationTextForAddress(address: HereGeocodeResponseAddress): string {
  console.log(JSON.stringify(address));
  // Get non-abbreviated country name
  const countryData = address.AdditionalData.find(d => d.key === "CountryName");
  let countryName = countryData ? countryData.value : address.Country;
  
  // If in the US, include the state and use country abbreviation
  if(address.Country === "USA") {
    countryName = address.State + ", USA";
  }
  if ("City" in address) {
    return address.City + ", " + countryName;
  } else {
    return countryName;
  }
}