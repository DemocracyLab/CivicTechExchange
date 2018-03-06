// @flow

import type {Project} from '../stores/ProjectSearchStore.js';
import type {LinkInfo} from '../../components/forms/LinkInfo.jsx'
import type {FileInfo} from '../common/FileInfo.jsx'

export type APIError = {|
  +errorCode: number,
  +errorMessage: string
|};

export type TagDefinition = {|
  value: string,
  label: string
|};

type ProjectAPIData = {|
  +project_id: number,
  +project_description: string,
  +project_issue_area: $ReadOnlyArray<TagDefinition>,
  +project_location: string,
  +project_name: string,
  +project_thumbnail: FileInfo
|};

export type ProjectDetailsAPIData = {|
  +project_id: number,
  +project_description: string,
  +project_creator: number,
  +project_url: string,
  +project_issue_area: $ReadOnlyArray<TagDefinition>,
  +project_location: string,
  +project_name: string,
  +project_thumbnail: FileInfo,
  +project_links: $ReadOnlyArray<LinkInfo>,
  +project_files: $ReadOnlyArray<FileInfo>,
|};

class ProjectAPIUtils {
  static projectFromAPIData(apiData: ProjectAPIData): Project {
    return {
      description: apiData.project_description,
      id: apiData.project_id,
      issueArea:
        apiData.project_issue_area && apiData.project_issue_area.length != 0
          ? apiData.project_issue_area[0].label
          : 'None',
      location: apiData.project_location,
      name: apiData.project_name,
      thumbnail: apiData.project_thumbnail
    };
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
}

export default ProjectAPIUtils
