import React from 'react';

class ProjectCard extends React.PureComponent {
  render() {
    return (
      <div className="ProjectCard-root">
        {this._renderName()}
        {this._renderIssueAndLocation()}
        {this.props.description}
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
}

export default ProjectCard;
