// @flow
import type {HereGeocodeResponse, HereGeocodeResponseAddress, HereGeocodeResponseLocation} from "../../utils/hereApi.js";
import _ from "lodash";
import type {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils";

export type LocationInfo = {|
  city: string,
  country: string,
  latitude: number,
  longitude: number,
  location_id: string,
  state: string
|};

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
  return project && {
    latitude: project.project_latitude,
    longitude: project.project_longitude,
    location_id: project.project_location,
    city: project.project_city,
    country: project.project_country,
    state: project.project_state
  };
}