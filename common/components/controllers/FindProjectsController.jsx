import ProjectCardsContainer from '../componentsBySection/FindProjects/ProjectCardsContainer.jsx';
import ProjectSearchContainer from '../componentsBySection/FindProjects/ProjectSearchContainer.jsx';
import React from 'react';
import Immutable from 'immutable'

class FindProjectsController extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      keyword: null,
      projects: Immutable.List(),
    };
  }

  componentWillMount() {
    this._loadProjects();
  }

  _loadProjects(keyword) {
    fetch(new Request(this._getAPIURL(keyword)))
      .then(response => response.json())
      .then(projects =>
        this.setState({
          projects: Immutable.List(projects.map(this._projectFromAPIData)),
        }),
      )
  }

  _getAPIURL(keyword) {
    const baseURL = '/api/projects';
    return keyword
      ? baseURL + '?keyword=' + keyword
      : baseURL;
  }

  _projectFromAPIData(apiData) {
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

  render() {
    return (
      <div className="FindProjectsController-root">
        <ProjectSearchContainer
          onSubmitKeyword={this._onSubmitKeyword.bind(this)}
        />
        <ProjectCardsContainer projects={this.state.projects}/>
      </div>
    );
  }

  _onSubmitKeyword(keyword) {
    this._loadProjects(keyword);
  }
}

export default FindProjectsController;
