// @flow

import CurrentUser from "./CurrentUser.js";
import { ProjectAPIData } from "./ProjectAPIUtils.js";
import type { FileInfo } from "../common/FileInfo.jsx";
import type { TagDefinition } from "./ProjectAPIUtils.js";

export type LocationTimezone = {|
  id: string,
  event_id: string,
  location_name: string,
  address_line_1: string,
  address_line_2: string,
  time_zone: string,
  country: string,
  state: string,
  city: string,
|};

export type EventData = {|
  event_id: string,
  event_creator: string,
  event_date_start: Date,
  event_date_end: Date,
  event_name: string,
  event_organizers_text: string,
  event_live_id: string,
  event_rsvp_url: string,
  event_agenda: string,
  event_location: string,
  event_description: string,
  event_short_description: string,
  event_thumbnail: FileInfo,
  event_projects: $ReadOnlyArray<ProjectAPIData>,
  event_legacy_organization: $ReadOnlyArray<TagDefinition>,
  event_slug: string,
  is_private: boolean,
  show_headers: boolean,
  event_conference_url: ?string,
  event_conference_admin_url: ?string,
  event_conference_participants: ?string,
  event_time_zones: $ReadOnlyArray<LocationTimezone>,
|};

export type EventTileAPIData = {|
  event_id: string,
  event_slug: string,
  event_date_start: Date,
  event_date_end: Date,
  event_name: string,
  event_organizers_text: string,
  event_location: string,
  event_short_description: string,
  event_thumbnail: FileInfo,
|};

export default class EventAPIUtils {
  static fetchEventDetails(
    id: number,
    callback: EventData => void,
    errCallback: APIError => void
  ): void {
    fetch(new Request("/api/event/" + id + "/", { credentials: "include" }))
      .then(response => {
        if (!response.ok) {
          throw Error();
        }
        return response.json();
      })
      .then(eventDetails => callback(eventDetails))
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

  static isOwner(event: EventData): boolean {
    return CurrentUser.userID() === event.event_creator;
  }
}
