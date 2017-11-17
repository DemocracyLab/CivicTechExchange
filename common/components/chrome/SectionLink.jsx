import React from 'react';

class ProjectLink extends React.Component {
  render() {
    return (
      <div
        className="SectionLink-root"
        onClick={this.props.onChangeSection}
        >
        {this.props.title}
      </div>
    );
  }
}

export default ProjectLink;
