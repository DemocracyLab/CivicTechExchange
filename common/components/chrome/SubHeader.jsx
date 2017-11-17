import SectionLinkConfigs from '../configs/SectionLinkConfigs.js';
import cx from '../utils/cx';
import SectionLink from './SectionLink.jsx';
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
        {this._renderSectionLinks()}
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

  _renderSectionLinks() {
    return SectionLinkConfigs
      .map(config =>
        <SectionLink
          key={config.title}
          title={config.title}
          onChangeSection={
            this.props.onChangeSection.bind(this, config.section)
          }
        />
      );
  }
}

export default SubHeader;
