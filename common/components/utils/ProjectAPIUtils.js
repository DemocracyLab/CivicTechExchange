// @flow

import type { LinkInfo } from "../../components/forms/LinkInfo.jsx";
import type { FileInfo } from "../common/FileInfo.jsx";
import { PositionInfo } from "../forms/PositionInfo.jsx";
import {
  LocationInfo,
  getLocationDisplayString,
} from "../common/location/LocationInfo.js";
import type { MyGroupData } from "./CurrentUser.js";
import type { GroupTileAPIData } from "./GroupAPIUtils.js";
import type { EventTileAPIData } from "./EventAPIUtils.js";
import type { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";

export type APIResponse = Response;

export type APIError = {|
  +errorCode: number,
  +errorMessage: string,
|};

export type TagDefinition = {|
  id: number,
  tag_name: string,
  display_name: string,
  caption: string,
  category: string,
  subcategory: string,
  parent: string,
|};

export type TagDefinitionCount = {|
  num_times: number,
|} & TagDefinition;

export type CardOperation = {|
  name: string,
  buttonVariant: ?string,
  url: ?string,
  target: ?string,
  operation: ?() => null,
  count: ?string,
|};

export type ProjectData = {|
  +id: number,
  +ownerId: number,
  +description: string,
  +issueArea: $ReadOnlyArray<TagDefinition>,
  +stage: $ReadOnlyArray<TagDefinition>,
  +location: string,
  +country: string,
  +state: string,
  +city: string,
  +name: string,
  +thumbnail: FileInfo,
  +claimed: boolean,
  +date_modified: string,
  +url: string,
  +video: ?LinkInfo,
  +cardUrl: ?string,
  +conferenceUrl: ?string,
  +conferenceCt: ?string,
  +cardOperation: ?CardOperation,
  +slug: ?string,
  +positions: $ReadOnlyArray<PositionInfo>,
|};

export type ProjectAPIData = {|
  +project_id: number,
  +project_creator: number,
  +project_description: string,
  +project_issue_area: $ReadOnlyArray<TagDefinition>,
  +project_stage: $ReadOnlyArray<TagDefinition>,
  +project_location: string,
  +project_country: string,
  +project_state: string,
  +project_city: string,
  +project_name: string,
  +project_thumbnail: ?FileInfo,
  +project_thumbnail_video: ?LinkInfo,
  +project_date_modified: string,
  +project_url: string,
  +project_positions: $ReadOnlyArray<PositionInfo>,
  +card_url: ?string,
  +project_slug: string,
|};

export type VolunteerUserData = {|
  +id: number,
  +first_name: string,
  +last_name: string,
  +user_thumbnail: FileInfo,
  +about_me: string,
|};

export type VolunteerDetailsAPIData = {|
  +application_id: number,
  +user: VolunteerUserData,
  +application_text: string,
  +application_date: string,
  +platform_date_joined: string,
  +roleTag: TagDefinition,
  +isApproved: boolean,
  +isCoOwner: boolean,
  +isTeamLeader: boolean,
  +isUpForRenewal: boolean,
|};

export type ProjectDetailsAPIData = {|
  +project_id: number,
  +project_description: string,
  +project_description_solution: string,
  +project_description_actions: string,
  +project_short_description: string,
  +project_creator: number,
  +project_claimed: boolean,
  +project_approved: boolean,
  +project_created: boolean,
  +project_url: string,
  +project_organization: $ReadOnlyArray<TagDefinition>,
  +project_organization_type: $ReadOnlyArray<TagDefinition>,
  +project_issue_area: $ReadOnlyArray<TagDefinition>,
  +project_stage: $ReadOnlyArray<TagDefinition>,
  +project_technologies: $ReadOnlyArray<TagDefinition>,
  +project_positions: $ReadOnlyArray<PositionInfo>,
  +project_groups: $ReadOnlyArray<MyGroupData>,
  +project_location: string,
  +project_country: string,
  +project_state: string,
  +project_city: string,
  +project_name: string,
  +project_thumbnail: FileInfo,
  +project_links: $ReadOnlyArray<LinkInfo>,
  +project_files: $ReadOnlyArray<FileInfo>,
  +project_owners: $ReadOnlyArray<VolunteerUserData>,
  +project_volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>,
  +project_date_modified: Date,
  +project_events: $ReadOnlyArray<EventTileAPIData>,
  +event_created_from: ?number,
  +project_slug: string,
  +is_private: boolean,
|};

export type TeamAPIData = {|
  +board_of_directors: string,
  +project: ProjectDetailsAPIData,
|};

export type Testimonial = {|
  +name: string,
  +avatar_url: string,
  +title: string,
  +text: string,
  +source: string,
|};

class ProjectAPIUtils {
  static projectFromAPIData(apiData: ProjectAPIData): ProjectData {
    const visiblePositions: $ReadOnlyArray<PositionInfo> = apiData.project_positions.filter(
      position => !position.isHidden
    );
    return {
      description: apiData.project_description,
      id: apiData.project_id,
      issueArea:
        apiData.project_issue_area && apiData.project_issue_area.length != 0
          ? apiData.project_issue_area[0].display_name
          : "None",
      stage:
        apiData.project_stage && apiData.project_stage.length != 0
          ? apiData.project_stage[0].display_name
          : "None",
      project_organization_type:
        apiData.project_organization_type &&
        apiData.project_organization_type.length != 0
          ? apiData.project_organization_type[0].display_name
          : "None",
      location: apiData.project_location,
      country: apiData.project_country,
      state: apiData.project_state,
      city: apiData.project_city,
      name: apiData.project_name,
      thumbnail: apiData.project_thumbnail,
      ownerId: apiData.project_creator,
      claimed: apiData.project_claimed,
      date_modified: apiData.project_date_modified,
      url: apiData.project_url,
      positions: !_.isEmpty(visiblePositions)
        ? ProjectAPIUtils.getSkillNames(visiblePositions)
        : ["Contact Project for Details"],
      video: apiData.project_thumbnail_video,
      conferenceUrl: apiData.conference_url,
      conferenceCt: apiData.conference_count,
      cardUrl: apiData.card_url,
      slug: apiData.project_slug,
    };
  }

  static getLocationDisplayName(
    project: ProjectAPIData | ProjectDetailsAPIData | ProjectData
  ): string {
    // TODO: See if we can deprecate ProjectData
    const location: LocationInfo = {
      location_id: project.project_location || project.location,
      city: project.project_city || project.city,
      state: project.project_state || project.state,
      country: project.project_country || project.country,
    };
    return getLocationDisplayString(location);
  }

  static getSkillNames(positions: $ReadOnlyArray<PositionInfo>) {
    return positions.map(position => position.roleTag.display_name);
  }

  static fetchProjectDetails(
    id: number,
    includeVolunteers: boolean,
    callback: ProjectDetailsAPIData => void,
    errCallback: APIError => void
  ): void {
    let url: string = "/api/project/" + id + "/";
    if (includeVolunteers) {
      url += "?includeVolunteers=1";
    }
    fetch(new Request(url, { credentials: "include" }))
      .then(response => {
        if (!response.ok) {
          throw Error();
        }
        return response.json();
      })
      .then(projectDetails => {
        callback(projectDetails);
        // TODO: Get catch to return http status code
      })
      .catch(
        response =>
          errCallback &&
          errCallback({
            errorCode: response.status,
            errorMessage: JSON.stringify(response),
          })
      );
  }

  // fetch project volunteers list
  static fetchProjectVolunteerList(
    id: number,
    callback: VolunteerDetailsAPIData => void,
    errCallback: APIError => void
  ): void {
    fetch(
      new Request("/api/project/" + id + "/volunteers/", {
        credentials: "include",
      })
    )
      .then(response => {
        if (!response.ok) {
          throw Error();
        }
        return response.json();
      })
      .then(response => {
        callback(response["project_volunteers"]);
      })
      .catch(
        response =>
          errCallback &&
          errCallback({
            errorCode: response.status,
            errorMessage: JSON.stringify(response),
          })
      );
  }

  // fetch specific category of tags
  static fetchTagsByCategory(
    tagCategory: string,
    getCounts: boolean,
    callback: ($ReadOnlyArray<TagDefinition>) => void,
    errCallback: APIError => void
  ): Promise<$ReadOnlyArray<TagDefinition>> {
    return fetch(
      new Request(
        "/api/tags?category=" + tagCategory + "&getCounts=" + getCounts ||
          "false"
      )
    ) //default to false if call doesn't pass a getCounts arg
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
  // fetch all tags in one API request
  static fetchAllTags(
    getCounts: boolean,
    callback: ($ReadOnlyArray<TagDefinition>) => void,
    errCallback: APIError => void
  ): Promise<$ReadOnlyArray<TagDefinition>> {
    return fetch(new Request("/api/tags?getCounts=" + getCounts || "false"))
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
  //fetch DemocracyLab board information
  static fetchTeamDetails(callback: TeamAPIData => void): void {
    fetch("/api/team")
      .then(response => {
        return response.json();
      })
      .then(data => {
        callback(data);
      })
      .catch(err => {
        console.log("Error fetching team details. Error: " + err);
      });
  }

  //fetch DemocracyLab testimonials
  static fetchTestimonials(
    category: ?string,
    callback: ($ReadOnlyArray<Testimonial>) => void
  ): void {
    const url: string = "/api/testimonials/" + (category || "");
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        callback(data);
      })
      .catch(err => {
        console.log("Error fetching testimonial details. Error: " + err);
      });
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

    let headers: Dictionary<string> = Object.assign(
      {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
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
        ProjectAPIUtils.isSuccessResponse(response)
          ? successCallback(response)
          : doError(response)
      );
    }

    if (errCallback) {
      promise = promise.catch(response => doError(response));
    }

    return promise;
  }

  static isSuccessResponse(response: APIResponse): boolean {
    return response.status < 400;
  }
}

export default ProjectAPIUtils;
