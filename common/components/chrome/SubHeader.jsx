import cx from '../utils/cx';
import React from 'react';
import Section from '../enums/Section.js'

class SubHeader extends React.Component {

  constructor() {
    super();
    this._cx = new cx('SubHeader-');
  }

  render() {
    return (
      <div className={this._cx.get('root')}>
        <span
          className={this._cx.get('sectionButton')}
          onClick={() => this.props.onChangeSection(Section.FindProjects)}
        >
          FIND PROJECTS
        </span>
        <span
          className={this._cx.get('sectionButton')}
          >
          MY PROJECTS
        </span>
        <span
          className={this._cx.get('sectionButton')}
          >
          PROFILE
        </span>
        <span
          className={this._cx.get('sectionButton')}
          >
          INBOX
        </span>
        <span className={this._cx.get('rightContent')}>
          <button
            className={this._cx.get('createProject')}
            >
            Create A Project
          </button>
        </span>
      </div>
    );
  }
}

export default SubHeader;
