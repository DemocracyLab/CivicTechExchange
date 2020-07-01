// @flow

import type {LinkInfo} from '../../components/forms/LinkInfo.jsx'
import type {FileInfo} from '../common/FileInfo.jsx'
import type {LocationInfo} from "../common/location/LocationInfo";
import {getLocationDisplayString} from "../common/location/LocationInfo";
import type {ProjectAPIData} from "./ProjectAPIUtils.js";

export type GroupDetailsAPIData = {|
    group_id: string,
    group_creator: string,
    group_name: string,
    group_description: string,
    group_short_description: string,
    group_location: ?string,
    group_country: ?string,
    group_state: ?string,
    group_city: ?string,
    group_url: ?string,
    group_date_modified: string,
    group_thumbnail: FileInfo,
    group_projects: $ReadOnlyArray<ProjectAPIData>,
    group_links: $ReadOnlyArray<LinkInfo>,
    group_files: $ReadOnlyArray<FileInfo>,
|};



export default class GroupAPIUtils {
    static fetchGroupDetails(id: number, callback: (GroupDetailsAPIData) => void, errCallback: (APIError) => void): void {
        fetch(new Request('/api/group/' + id + '/', {credentials: 'include'}))
            .then(response => {
                if(!response.ok) {
                    throw Error();
                }
                return response.json();
            })
            .then(groupDetails => callback(groupDetails))
            // TODO: Get catch to return http status code
            .catch(response => errCallback && errCallback({
                errorCode: response.status,
                errorMessage: JSON.stringify(response)
            }));
    }
    
    static getLocationDisplayName(group: GroupDetailsAPIData): string {
        const location: LocationInfo = {
            location_id: group.group_location,
            city: group.group_city,
            state: group.group_state,
            country: group.group_country
        };
        return getLocationDisplayString(location);
    }
  
}