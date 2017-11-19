import React from 'react';

class ProjectCard extends React.PureComponent {
  render() {
    return (
      <div className="ProjectCard-root">
        {this._renderName()}
        {this._renderIssueAndLocation()}
        {this._renderDescription()}
      </div>
    );
  }

  _renderName() {
    return (
      <div className="ProjectCard-name">
        {this.props.name}
      </div>
    );
  }

  _renderIssueAndLocation() {
    return (
      <div className="ProjectCard-issueAndLocation">
        <div>
          Issue Area: {this.props.issueArea}
        </div>
        <div>
            Location: {this.props.location}
        </div>
      </div>
    );
  }

  _renderDescription() {
    const maxDescriptionLength = 300;
    return this.props.description.length > maxDescriptionLength
      ? this.props.description.slice(0, maxDescriptionLength) + '...'
      : this.props.description;
  }
}

export default ProjectCard;
