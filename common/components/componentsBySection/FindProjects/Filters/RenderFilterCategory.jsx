// @flow

import React from 'react';
// import _ from 'lodash'



class RenderFilterCategory<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super(props);
  }

  render(): React$Node {
    let sortedTags = Object.values(this.props.data).map((tag) =>
        <li key={tag.display_name}>{tag.display_name} - {tag.num_times}</li>
      );
    return (
        <React.Fragment>
          <h4>{this.props.category}</h4>
          <ul>{sortedTags}</ul>
        </React.Fragment>
    );
  }
}

export default RenderFilterCategory;
