// @flow

import React from 'react';
// import _ from 'lodash'

const categoryDisplayNames = {
  'Issue(s) Addressed': "Issue Areas",
  'Role': "Roles Needed",
}

class RenderFilterCategory<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super(props);
  }

  _displayName(input) {
    //replaces specific db categorynames to display names we want
    return categoryDisplayNames[input] || input;
  }

  render(): React$Node {
    let sortedTags = Object.values(this.props.data).map((tag) =>
        <li key={tag.category + '-' + tag.display_name}>{tag.display_name} - {tag.num_times}</li>
      );
    return (
        <React.Fragment>
          <h4>{this._displayName(this.props.category)} - {this.props.categoryCount}</h4>
          <ul>{sortedTags}</ul>
        </React.Fragment>
    );
  }
}

export default RenderFilterCategory;
