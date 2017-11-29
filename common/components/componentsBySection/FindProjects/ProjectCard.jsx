// @flow

import cx from '../../utils/cx';
import React from 'react';

type Props = {|
  +description: string,
  +issueArea: string,
  +location: string,
  +name: string,
|};

class ProjectCard extends React.PureComponent<Props> {

  _cx: cx;

  constructor(): void {
    super();
    this._cx = new cx('ProjectCard-');
  }

  render(): React$Node {
    return (
      <div className="ProjectCard-root">
        {this._renderName()}
        {this._renderIssueAndLocation()}
        {/* <div className="ProjectCard-description ProjectCard-subtext ProjectCard-value"> */}
        <div className={this._cx.get('description', 'subtext', 'value')}>
          {this._renderDescription()}
        </div>
      </div>
    );
  }

  _renderName(): React$Node {
    return (
      <div className="ProjectCard-name">
        {this.props.name}
      </div>
    );
  }

  _renderIssueAndLocation(): React$Node {
    return (
      <div className="ProjectCard-issueAndLocation">
        {this._renderLabelAndValue('Issue Area: ', this.props.issueArea)}
        {this._renderLabelAndValue('Location: ', this.props.location)}
      </div>
    );
  }

  _renderLabelAndValue(label: string, value: string): React$Node {
      return (
        <div className="ProjectCard-subtext">
          <span className="ProjectCard-label">
            {label}
          </span>
          <span className="ProjectCard-value">
            {value}
          </span>
        </div>
      );
  }

  _renderDescription(): string {
    const maxDescriptionLength = 300;
    return this.props.description.length > maxDescriptionLength
      ? this.props.description.slice(0, maxDescriptionLength) + '...'
      : this.props.description;
  }
}

export default ProjectCard;
