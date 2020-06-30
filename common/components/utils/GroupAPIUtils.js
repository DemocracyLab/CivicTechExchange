// @flow

import type {LinkInfo} from '../../components/forms/LinkInfo.jsx'
import type {FileInfo} from '../common/FileInfo.jsx'

export type GroupDetailsAPIData = {|
    group_id: string,
    group_creator: string,
    group_name: string,
    group_description: string,
    group_short_description: string,
    group_url: ?string,
    group_date_modified: string,
    group_thumbnail: FileInfo,
    group_projects: $ReadOnlyArray<Project>,
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
}