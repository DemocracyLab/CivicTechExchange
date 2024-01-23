// @flow

import type { LinkInfo } from "../forms/LinkInfo.jsx";
import type { FileInfo } from "../common/FileInfo.jsx";
import {
  LocationInfo,
  getLocationDisplayString,
} from "../common/location/LocationInfo.js";
import type {
  ProjectAPIData,
  TagDefinition,
  APIError,
} from "./ProjectAPIUtils.js";
import type { Dictionary } from "../types/Generics.jsx";
import htmlDocument from "./htmlDocument.js";

export type GroupTileAPIData = {|
  group_id: string,
  group_name: string,
  group_date_modified: string,
  group_location: ?string,
  group_country: ?string,
  group_state: ?string,
  group_city: ?string,
  group_thumbnail: FileInfo,
  group_project_count: number,
  group_issue_areas: Dictionary<TagDefinition>,
  group_slug: ?string,
|};

export type GroupDetailsAPIData = {|
  group_creator: string,
  group_description: string,
  group_short_description: string,
  group_links: $ReadOnlyArray<LinkInfo>,
  group_files: $ReadOnlyArray<FileInfo>,
  is_private: boolean,
|} & GroupTileAPIData;

export type ProjectRelationshipAPIData = {|
  project_relationship_id: number,
  relationship_is_approved: boolean,
|} & ProjectAPIData;

export default class GroupAPIUtils {
  static fetchGroupDetails(
    id: number,
    callback: GroupDetailsAPIData => void,
    errCallback: APIError => void
  ): void {
    fetch(new Request("/api/group/" + id + "/", { credentials: "include" }))
      .then(response => {
        if (!response.ok) {
          throw Error();
        }
        return response.json();
      })
      .then(groupDetails => callback(groupDetails))
      // TODO: Get catch to return http status code
      .catch(
        response =>
          errCallback &&
          errCallback({
            errorCode: response.status,
            errorMessage: JSON.stringify(response),
          })
      );
  }
  static removeProjectFromGroup({group_id,project_id},callback:()=>void,errCallback:(APIError)=>void){

  }
  static fetchAllTags(
    callback: ($ReadOnlyArray<TagDefinition>) => void,
    errCallback: APIError => void
  ): Promise<$ReadOnlyArray<TagDefinition>> {
    return fetch(new Request("/api/tags/groups"))
      .then(response => response.json())
      .then(tags => callback(tags))
      .catch(
        response =>
          errCallback &&
          errCallback({
            errorCode: response.status,
            errorMessage: JSON.stringify(response),
          })
      );
  }

  static getLocationDisplayName(group: GroupDetailsAPIData): string {
    const location: LocationInfo = {
      location_id: group.group_location,
      city: group.group_city,
      state: group.group_state,
      country: group.group_country,
    };
    return getLocationDisplayString(location);
  }
}
