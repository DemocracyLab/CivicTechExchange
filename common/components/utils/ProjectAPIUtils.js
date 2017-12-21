// @flow

import type {Project} from '../stores/ProjectSearchStore.js';

type ProjectAPIData = {|
  +id: number,
  +project_description: string,
  +project_issue_area: $ReadOnlyArray<{|+name: string|}>,
  +project_location: string,
  +project_name: string,
|};

class ProjectAPIUtils {
  static projectFromAPIData(apiData: ProjectAPIData): Project {
    return {
      description: apiData.project_description,
      id: apiData.id,
      issueArea:
        apiData.project_issue_area && apiData.project_issue_area.length != 0
          ? apiData.project_issue_area[0].name
          : 'None',
      location: apiData.project_location,
      name: apiData.project_name,
    };
  }
}

export default ProjectAPIUtils
