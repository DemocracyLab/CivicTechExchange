// @flow

import type {Tag} from '../../stores/TagStore.js';

import ProjectSearchDispatcher from '../../stores/ProjectSearchDispatcher.js';
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
    return (
      <span
        className="ProjectTag-closeButton"
        onClick={() => {
          ProjectSearchDispatcher.dispatch({
            type: 'REMOVE_TAG',
            tag: this.props.tag,
          })}
        }>
        ×
      </span>
    );
  }
}

export default ProjectTag;
