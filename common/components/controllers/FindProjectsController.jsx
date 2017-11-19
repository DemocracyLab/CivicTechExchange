import ProjectCardsContainer from '../componentsBySection/ProjectCardsContainer.jsx';
import ProjectSearchContainer from '../componentsBySection/ProjectSearchContainer.jsx';
import React from 'react';

class FindProjectsController extends React.Component {

  constructor() {
    super();
    this.state = {
      keyword: null,
      projects: null,
    };
  }

  componentWillMount() {
    this._loadProjects();
  }

  _loadProjects(keyword) {
    fetch(new Request(this._getAPIURL(keyword)))
      .then(response => response.json())
      .then(projects =>
        this.setState({projects: projects.map(this._projectFromAPIData)}),
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
      // TODO issueArea, location not received from API
      issueArea: 'Social Justice',
      location: 'Seattle, WA',
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
