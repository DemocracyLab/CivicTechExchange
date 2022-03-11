// @flow

import type { FileInfo } from "../common/FileInfo.jsx";
import type { TagDefinition } from "./ProjectAPIUtils.js";
import type { LinkInfo } from "../forms/LinkInfo.jsx";
import { PositionInfo } from "../forms/PositionInfo.jsx";

export type EventProjectAPIDetails = {|
  event_project_id: string,
  event_project_creator: string,
  event_project_positions: $ReadOnlyArray<PositionInfo>,
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
  project_id: number,
  project_description: string,
  project_description_solution: ?string,
  project_short_description: string,
  project_technologies: $ReadOnlyArray<TagDefinition>,
  project_name: string,
  project_thumbnail: ?FileInfo,
  project_thumbnail_video: ?LinkInfo,
|};

export default class EventProjectAPIUtils {
  static fetchEventProjectDetails(
    eventId: number,
    projectId: number,
    callback: EventProjectAPIDetails => void,
    errCallback: APIError => void
  ): void {
    fetch(
      new Request(`/api/event/${eventId}/project/${projectId}/`, {
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
}
