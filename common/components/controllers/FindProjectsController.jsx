// @flow

import ProjectCardsContainer from '../componentsBySection/FindProjects/ProjectCardsContainer.jsx';
import ProjectSearchContainer from '../componentsBySection/FindProjects/ProjectSearchContainer.jsx';
import React from 'react';
import {List} from 'immutable'

type State = {|
  keyword: ?string,
  projects: List<Project>
|};

type ProjectAPIData = {|
  +project_description: string,
  +project_issue_area: $ReadOnlyArray<{|+name: string|}>,
  +project_location: string,
  +project_name: string,
|};

export type Project = {|
  +description: string,
  +issueArea: string,
  +location: string,
  +name: string,
|};

class FindProjectsController extends React.PureComponent<{||}, State> {

  constructor(): void {
    super();
    this.state = {
      keyword: null,
      projects: List(),
    };
  }

  componentWillMount(): void {
    this._loadProjects();
  }

  _loadProjects(keyword: ?string): void {
    fetch(new Request(this._getAPIURL(keyword)))
      .then(response => response.json())
      .then(projects =>
        this.setState({
          projects: List(projects.map(this._projectFromAPIData)),
        }),
      )
  }

  _getAPIURL(keyword: ?string): string {
    const baseURL = '/api/projects';
    return keyword
      ? baseURL + '?keyword=' + keyword
      : baseURL;
  }

  _projectFromAPIData(apiData: ProjectAPIData): Project {
    return {
      description: apiData.project_description,
      issueArea:
        apiData.project_issue_area.length != 0
          ? apiData.project_issue_area[0].name
          : 'None',
      location: apiData.project_location,
      name: apiData.project_name,
    };
  }

  render(): React$Node {
    return (
      <div className="FindProjectsController-root">
        <ProjectSearchContainer
          onSubmitKeyword={this._onSubmitKeyword.bind(this)}
        />
        <ProjectCardsContainer projects={this.state.projects}/>
      </div>
    );
  }

  _onSubmitKeyword(keyword: string): void {
    this._loadProjects(keyword);
  }
}

export default FindProjectsController;
