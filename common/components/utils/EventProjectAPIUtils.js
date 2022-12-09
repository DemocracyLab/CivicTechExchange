// @flow

import type { FileInfo } from "../common/FileInfo.jsx";
import type { LinkInfo } from "../forms/LinkInfo.jsx";
import { PositionInfo } from "../forms/PositionInfo.jsx";
import {
  TagDefinition,
  APIError,
  APIResponse,
  VolunteerUserData,
} from "./ProjectAPIUtils.js";
import apiHelper from "./api.js";

export type VolunteerRSVPDetailsAPIData = {|
  +application_id: number,
  +user: VolunteerUserData,
  +application_text: string,
  +application_date: string,
  +roleTag: TagDefinition,
|};

export type EventProjectAPIDetails = {|
  event_project_id: string,
  event_project_creator: string,
  event_project_positions: $ReadOnlyArray<PositionInfo>,
  event_project_volunteers: $ReadOnlyArray<VolunteerRSVPDetailsAPIData>,
  event_project_files: $ReadOnlyArray<FileInfo>,
  event_project_links: $ReadOnlyArray<LinkInfo>,
  event_project_goal: ?string,
  event_project_agenda: ?string,
  event_project_scope: ?string,
  event_project_onboarding_notes: ?string,
  event_id: string,
  event_date_start: Date,
  event_date_end: Date,
  event_name: string,
  event_location: string,
  event_thumbnail: FileInfo,
  event_slug: string,
  event_time_zones: $ReadOnlyArray<LocationTimezone>,
  project_id: number,
  project_description: string,
  project_description_solution: ?string,
  project_short_description: string,
  project_technologies: $ReadOnlyArray<TagDefinition>,
  project_name: string,
  project_thumbnail: ?FileInfo,
  project_thumbnail_video: ?LinkInfo,
  is_activated: boolean,
  event_conference_url: ?string,
  event_conference_admin_url: ?string,
  event_conference_participants: ?string,
  project_location: ?string,
  project_country: ?string,
  project_state: ?string,
  project_city: ?string,
  project_url: ?string,
|};

export default class EventProjectAPIUtils {
  static fetchEventProjectDetails(
    eventId: number,
    projectId: number,
    callback: EventProjectAPIDetails => void,
    errCallback: APIError => void
  ): void {
    fetch(
      new Request(`/api/event/${eventId}/projects/${projectId}/`, {
        credentials: "include",
      })
    )
      .then(response => {
        if (!response.ok) {
          throw Error();
        }
        return response.json();
      })
      .then(eventDetails => {
        return callback(eventDetails);
      })
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

  static rsvpForEvent(
    eventId: number,
    isRemote: boolean,
    locationTimeZone: LocationTimezone,
    successCallback: ?(APIResponse) => void,
    errCallback: ?(APIError) => void
  ): void {
    const url: string = `/api/event/${eventId}/rsvp/`;
    return apiHelper.post(
      url,
      { isRemote: isRemote, locationTimeZone: locationTimeZone },
      successCallback,
      errCallback
    );
  }

  static rsvpEventCancel(
    eventId: number,
    successCallback: ?(APIResponse) => void,
    errCallback: ?(APIError) => void
  ): void {
    const url: string = `/api/event/${eventId}/rsvp/cancel/`;
    return apiHelper.post(url, {}, successCallback, errCallback);
  }

  static rsvpForEventProject(
    eventId: number,
    projectId: number,
    message: string,
    roleTag: string,
    isRemote: boolean,
    locationTimeZone: LocationTimezone,
    successCallback: ?(APIResponse) => void,
    errCallback: ?(APIError) => void
  ): void {
    const url: string = `/api/event/${eventId}/projects/${projectId}/rsvp/`;
    return apiHelper.post(
      url,
      {
        applicationText: message,
        roleTag: roleTag,
        isRemote: isRemote,
        locationTimeZone: locationTimeZone,
      },
      successCallback,
      errCallback
    );
  }

  static cancelEventProject(
    eventId: number,
    projectId: number,
    successCallback: ?(APIResponse) => void,
    errCallback: ?(APIError) => void
  ): void {
    const url: string = `/api/event/${eventId}/projects/${projectId}/cancel/`;
    return apiHelper.post(url, {}, successCallback, errCallback);
  }
}
