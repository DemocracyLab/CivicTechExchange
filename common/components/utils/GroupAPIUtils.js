// @flow

import type {Project} from '../stores/ProjectSearchStore.js';
import type {LinkInfo} from '../../components/forms/LinkInfo.jsx'
import type {FileInfo} from '../common/FileInfo.jsx'
// import {PositionInfo} from "../forms/PositionInfo.jsx";

export type GroupDetailsAPIData = {|
    id: string,
    group_name: string,
    group_location: string,
    group_description: string,
    group_short_description: string,
    // group_projects: $ReadOnlyArray<Project>,
    // group_links: $ReadOnlyArray<LinkInfo>,
    // group_files: $ReadOnlyArray<FileInfo>,
|};


export default class GroupAPIUtils {
    static fetchGroupDetails(id: number, callback: (ProjectDetailsAPIData) => void, errCallback: (APIError) => void): void {
        fetch(new Request('/api/groups/' + id + '/', {credentials: 'include'}))
            .then(response => {
                console.log('GroupAPIUtiles.fetchGroupDetails:then', response.json());
                if(!response.ok) {
                    throw Error();
                }
                return response.json();
            })
            .then(projectDetails => callback(projectDetails))
            // TODO: Get catch to return http status code
            .catch(response => errCallback && errCallback({
                errorCode: response.status,
                errorMessage: JSON.stringify(response)
            }));
  }


}

// class ProjectAPIUtils {
//   static projectFromAPIData(apiData: ProjectAPIData): ProjectData {
//     return {
//       description: apiData.project_description,
//       id: apiData.project_id,
//       issueArea:
//         apiData.project_issue_area && apiData.project_issue_area.length != 0
//           ? apiData.project_issue_area[0].display_name
//           : 'None',
//       stage:
//         apiData.project_stage && apiData.project_stage.length !=0
//           ? apiData.project_stage[0].display_name
//           : 'None',
//       project_organization_type:
//         apiData.project_organization_type && apiData.project_organization_type.length != 0
//           ? apiData.project_organization_type[0].display_name
//           : 'None',
//       location: apiData.project_location,
//       name: apiData.project_name,
//       thumbnail: apiData.project_thumbnail,
//       ownerId: apiData.project_creator,
//       claimed: apiData.project_claimed,
//       date_modified: apiData.project_date_modified,
//       url: apiData.project_url,
//       positions: !_.isEmpty(apiData.project_positions)
//           ? ProjectAPIUtils.getSkillNames(apiData.project_positions)
//           : ['Contact Project for Details'],
//     };
//   }

//   static getSkillNames(positions: array) {
//     return positions.map(function(data) {
//       return data.roleTag.display_name
//     });
//   }

//   static fetchProjectDetails(id: number, callback: (ProjectDetailsAPIData) => void, errCallback: (APIError) => void): void {
//     fetch(new Request('/api/project/' + id + '/', {credentials: 'include'}))
//       .then(response => {
//         if(!response.ok) {
//           throw Error();
//         }
//         return response.json();
//       })
//       .then(projectDetails => callback(projectDetails))
//       // TODO: Get catch to return http status code
//       .catch(response => errCallback && errCallback({
//         errorCode: response.status,
//         errorMessage: JSON.stringify(response)
//       }));
//   }
//   // fetch specific category of tags
//   static fetchTagsByCategory(tagCategory: string, getCounts: boolean, callback: ($ReadOnlyArray<TagDefinition>) => void, errCallback: (APIError) => void): Promise<$ReadOnlyArray<TagDefinition>> {
//     return fetch(new Request('/api/tags?category=' + tagCategory + '&getCounts=' + getCounts || 'false')) //default to false if call doesn't pass a getCounts arg
//       .then(response => response.json())
//       .then(tags => callback(tags))
//       .catch(response => errCallback && errCallback({
//         errorCode: response.status,
//         errorMessage: JSON.stringify(response)
//       }));
//   }
//   // fetch all tags in one API request
//   static fetchAllTags(getCounts: boolean, callback: ($ReadOnlyArray<TagDefinition>) => void, errCallback: (APIError) => void): Promise<$ReadOnlyArray<TagDefinition>> {
//     return fetch(new Request('/api/tags?getCounts=' + getCounts || 'false'))
//       .then(response => response.json())
//       .then(tags => callback(tags))
//       .catch(response => errCallback && errCallback({
//         errorCode: response.status,
//         errorMessage: JSON.stringify(response)
//       }));
//   }
//   //fetch DemocracyLab statistics
//   static fetchStatistics(callback) {
//     fetch('/api/stats')
//     .then(response => {
//       return response.json()
//     })
//     .then(data => {
//       callback(data);
//     })
//     .catch(err => {
//       console.log('Error fetching stats API. Error: ' + err)
//     })
//   }

//   static post(url: string, body: {||},successCallback: (APIResponse) => void, errCallback: (APIError) => void) {
//     const doError = (response) => errCallback && errCallback({
//       errorCode: response.status,
//       errorMessage: JSON.stringify(response)
//     });

//     fetch(new Request(url, {method:"POST", body:JSON.stringify(body), credentials:"include", headers: {
//       'Accept': 'application/json, text/plain, */*',
//       'Content-Type': 'application/json'
//     },}))
//       .then(response => ProjectAPIUtils.isSuccessResponse(response) ? successCallback() : doError(response))
//       .catch(response => doError(response));
//   }

//   static isSuccessResponse(response:APIResponse): boolean {
//     return response.status < 400;
//   }
// }

// export default ProjectAPIUtils
