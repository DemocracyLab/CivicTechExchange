import ProjectCard from '../componentsBySection/ProjectCard.jsx';
import React from 'react';

class ProjectCardsContainer extends React.PureComponent {
  render() {
    return (
      <div>
        {this._renderDummyCards()}
      </div>
    );
  }

  _renderDummyCards() {
    return Array(20)
      .fill(this._getDummyCardProps())
      .map((props, index) =>
        <ProjectCard
          description={props.description}
          key={index}
          issueArea={props.issueArea}
          location={props.location}
          name={props.name}
        />
      );
  }

  _getDummyCardProps() {
    return {
      description: '"The pharmaceutical and insurance industries are legally empowered to hold sick children hostage while their parents frantically bankrupt themselves trying to save their sons or daughters." -- Chris Hedges',
      issueArea: 'Social Justice',
      location: 'Seattle',
      name: 'Incite Socialist Revolution'
    }
  }
}

export default ProjectCardsContainer;
