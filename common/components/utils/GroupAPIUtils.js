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
  static async removeProjectFromGroup({groupId,projectId,message},callback:?(APIResponse)=>void,errCallback:?(APIError)=>void){
    const url =
      `/api/groups/${groupId}/projects/remove/${projectId}/`;
    return this.post(
      url,
      {message},
      callback,
      errCallback
    );
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
  static post(
    url: string,
    body: {||},
    successCallback: ?(APIResponse) => void,
    errCallback: ?(APIError) => void,
    additionalHeaders: ?Dictionary<string>
  ): Promise<APIResponse> {
    const doError = response =>
      errCallback &&
      errCallback({
        errorCode: response.status,
        errorMessage: JSON.stringify(response),
      });

    const cookies = htmlDocument.cookies();
    let headers: Dictionary<string> = Object.assign(
      {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": cookies["csrftoken"],
      },
      additionalHeaders
    );

    let promise: Promise<APIResponse> = fetch(
      new Request(url, {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
        headers: headers,
      })
    );

    if (successCallback) {
      promise = promise.then(response =>
        (response.status < 400)?
           successCallback(response)
          : doError(response)
      );
    }

    if (errCallback) {
      promise = promise.catch(response => doError(response));
    }

    return promise;
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
