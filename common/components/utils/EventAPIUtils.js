// @flow

import CurrentUser from "./CurrentUser.js";

export type EventData = {|
    id: string,
    event_creator: string,
    event_start_date: Date,
    event_end_date: Date,
    event_name: string,
    event_rsvp_url: string,
    event_agenda: string,
    event_location: string,
    event_description: string,
    event_short_description: string,
    // event_projects: any,
    // event_files: any,
|};

export default class EventAPIUtils {
    static fetchEventDetails(id: number, callback: (EventData) => void, errCallback: (APIError) => void): void {
        fetch(new Request('/api/event/' + id + '/', {credentials: 'include'}))
          .then(response => {
              if (!response.ok) {
                  throw Error();
              }
              return response.json();
          })
          .then(eventDetails => callback(eventDetails))
          // TODO: Get catch to return http status code
          .catch(response => errCallback && errCallback({
              errorCode: response.status,
              errorMessage: JSON.stringify(response)
          }));
    }
    
    static isOwner(event: EventData): boolean {
        return CurrentUser.userID() === event.event_creator;
    }
}