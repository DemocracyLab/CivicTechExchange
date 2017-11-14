import React from 'react';
import Section from '../enums/Section.js'

class SubHeader extends React.Component {
  render() {
    return (
      <div className="SubHeader-root">
        <span onClick={() => this.props.onChangeSection(Section.FindProjects)}>FIND PROJECTS</span>
        <span>MY PROJECTS</span>
        <span>PROFILE</span>
        <span>INBOX</span>
        <span className="SubHeader-rightContent">
          <button>Create A Project</button>
        </span>
      </div>
    );
  }
}

export default SubHeader;
