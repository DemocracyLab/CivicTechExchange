// @flow

import React from 'react';

type Props = {|
  +description: string,
  +issueArea: string,
  +location: string,
  +name: string,
|};

class ProjectCard extends React.PureComponent<Props> {
  render(): React$Node {
    return (
      <div className="ProjectCard-root">
        {this._renderName()}
        {this._renderIssueAndLocation()}
        {this._renderDescription()}
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
        <div>
          Issue Area: {this.props.issueArea}
        </div>
        <div>
            Location: {this.props.location}
        </div>
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
