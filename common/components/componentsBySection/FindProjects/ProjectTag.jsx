// @flow

import type {Tag} from '../../stores/TagStore.js';

import React from 'react';

type Props = {|
  tag: Tag,
|};

class ProjectTag extends React.PureComponent<Props> {

  render(): React$Node {
    return (
      <span className="ProjectTag-root">
        {this.props.tag.displayName}
        {this._renderCloseButton()}
      </span>
    );
  }

  _renderCloseButton(): React$Node {
    // TODO add onClick handler
    return (
      <span className="ProjectTag-closeButton">
        ×
      </span>
    );
  }
}

export default ProjectTag;
