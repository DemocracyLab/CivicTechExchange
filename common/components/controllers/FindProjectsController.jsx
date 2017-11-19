import ProjectCardsContainer from '../componentsBySection/ProjectCardsContainer.jsx';
import ProjectSearchContainer from '../componentsBySection/ProjectSearchContainer.jsx';
import React from 'react';

class FindProjectsController extends React.Component {

  constructor() {
    super();
    this.state = {
      projects: null,
    };
  }

  componentWillMount() {
    fetch(new Request('/api/projects'))
      .then(response => response.json())
      .then(projects =>
        this.setState({projects: projects.map(this._projectFromAPIData)}),
      )
  }

  _projectFromAPIData(apiData) {
    return {
      description: apiData.project_description,
      // TODO location not received from API
      location: 'Seattle, WA',
      name: apiData.project_name,
    };
  }

  render() {
    return (
      <div className="FindProjectsController-root">
        <ProjectSearchContainer />
        <ProjectCardsContainer projects={this.state.projects}/>
      </div>
    );
  }

}

export default FindProjectsController;
