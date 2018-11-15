// @flow

// import type {Project} from '../stores/ProjectSearchStore.js';
import type {LinkInfo} from '../../components/forms/LinkInfo.jsx'
import type {FileInfo} from '../common/FileInfo.jsx'
import {PositionInfo} from "../forms/PositionInfo.jsx";

export type APIResponse = {|
  +status: number
|};

export type APIError = {|
  +errorCode: number,
  +errorMessage: string
|};

// TODO: Condense redundant tag definitions
export type TagDefinition = {|
  id: number,
  tag_name: string,
  display_name: string,
  caption: string,
  category: string,
  subcategory: string,
  parent: string,
|};

export type ProjectData = {|
  +id: number,
  +ownerId: number,
  +description: string,
  +issueArea: $ReadOnlyArray<TagDefinition>,
  +stage: $ReadOnlyArray<TagDefinition>,
  +location: string,
  +name: string,
  +thumbnail: FileInfo,
  +claimed: boolean,
  +date_modified: string
|};

export type ProjectAPIData = {|
  +project_id: number,
  +project_creator: number,
  +project_description: string,
  +project_issue_area: $ReadOnlyArray<TagDefinition>,
  +project_stage: $ReadOnlyArray<TagDefinition>,
  +project_location: string,
  +project_name: string,
  +project_thumbnail: FileInfo,
  +project_date_modified: string,
  +project_url: string,
  +project_positions: $ReadOnlyArray<PositionInfo>
|};

export type VolunteerUserData = {|
  +id: number,
  +first_name: string,
  +last_name: string,
  +user_thumbnail: FileInfo
|}

export type VolunteerDetailsAPIData = {|
  +application_id: number,
  +user: VolunteerUserData,
  +application_text: string,
  +roleTag: TagDefinition,
  +isApproved: boolean
|}

export type ProjectDetailsAPIData = {|
  +project_id: number,
  +project_description: string,
  +project_short_description: string,
  +project_creator: number,
  +project_claimed: boolean,
  +project_url: string,
  +project_organization: $ReadOnlyArray<TagDefinition>,
  +project_issue_area: $ReadOnlyArray<TagDefinition>,
  +project_stage: $ReadOnlyArray<TagDefinition>,
  +project_technologies: $ReadOnlyArray<TagDefinition>,
  +project_positions: $ReadOnlyArray<PositionInfo>,
  +project_location: string,
  +project_name: string,
  +project_thumbnail: FileInfo,
  +project_links: $ReadOnlyArray<LinkInfo>,
  +project_files: $ReadOnlyArray<FileInfo>,
  +project_volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>,
  +project_date_modified: Date
|};

class ProjectAPIUtils {
  static projectFromAPIData(apiData: ProjectAPIData): ProjectData {
    return {
      description: apiData.project_description,
      id: apiData.project_id,
      issueArea:
        apiData.project_issue_area && apiData.project_issue_area.length != 0
          ? apiData.project_issue_area[0].display_name
          : 'None',
      stage:
        apiData.project_stage && apiData.project_stage.length !=0
          ? apiData.project_stage[0].display_name
          : 'None',
      location: apiData.project_location,
      name: apiData.project_name,
      thumbnail: apiData.project_thumbnail,
      ownerId: apiData.project_creator,
      claimed: apiData.project_claimed,
      date_modified: apiData.project_date_modified,
      url: apiData.project_url,
      positions: !_.isEmpty(apiData.project_positions)
          ? ProjectAPIUtils.getSkillNames(apiData.project_positions)
          : ['Contact Project for Details'],
    };
  }

  static getSkillNames(positions: array) {
    return positions.map(function(data) {
      return data.roleTag.display_name
    });
  }

  static fetchProjectDetails(id: number, callback: (ProjectDetailsAPIData) => void, errCallback: (APIError) => void): void {
    fetch(new Request('/api/project/' + id + '/'))
      .then(response => {
        if(!response.ok) {
          throw Error();
        }
        return response.json();
      })
      .then(projectDetails => callback(projectDetails))
      .catch(response => errCallback && errCallback({
        errorCode: response.status,
        errorMessage: JSON.stringify(response)
      }));
  }

  static fetchTagsByCategory(tagCategory: string, getCounts: boolean, callback: ($ReadOnlyArray<TagDefinition>) => void, errCallback: (APIError) => void): Promise<$ReadOnlyArray<TagDefinition>> {
    return fetch(new Request('/api/tags?category=' + tagCategory + '&getCounts=' + getCounts || 'false')) //default to false if call doesn't pass a getCounts arg
      .then(response => response.json())
      .then(tags => callback(tags))
      .catch(response => errCallback && errCallback({
        errorCode: response.status,
        errorMessage: JSON.stringify(response)
      }));
  }

  static post(url: string, body: {||},successCallback: (APIResponse) => void, errCallback: (APIError) => void) {
    const doError = (response) => errCallback && errCallback({
      errorCode: response.status,
      errorMessage: JSON.stringify(response)
    });

    fetch(new Request(url, {method:"POST", body:JSON.stringify(body), credentials:"include", headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },}))
      .then(response => ProjectAPIUtils.isSuccessResponse(response) ? successCallback() : doError(response))
      .catch(response => doError(response));
  }

  static isSuccessResponse(response:APIResponse): boolean {
    return response.status < 400;
  }
}

export default ProjectAPIUtils
