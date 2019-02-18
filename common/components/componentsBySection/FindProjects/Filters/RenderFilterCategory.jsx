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
    //replaces specified database-generated names to chosen display names
    return categoryDisplayNames[input] || input;
  }


  _renderWithSubcategories() {
    //if hasSubcategories is true, we need to group, sort, and render each subcategory much like categories are sorted and rendered in the parent component
    //group by subcategories
    let groupedSubcats = _.groupBy(this.props.data, 'subcategory');
    let sortedKeys = Object.keys(groupedSubcats).sort(); //default sort is alphabetical, what we want

    const displaySubcategories = sortedKeys.map(key =>
          <React.Fragment>
            <h5>{key} - {_.sumBy(groupedSubcats[key], 'num_times')}</h5>
            {this._renderFilterList(groupedSubcats[key])}
          </React.Fragment>
        );
      return (
        <div>
          <h4>{this._displayName(this.props.category)} - {this.props.categoryCount}</h4>
          {displaySubcategories}
        </div>
      )
  }
  _renderNoSubcategories() {
    //if a category has NO subcategories (hasSubcategories is false), render a single list
    return (
        <React.Fragment>
          <h4>{this._displayName(this.props.category)} - {this.props.categoryCount}</h4>
          {this._renderFilterList(this.props.data)}
        </React.Fragment>
    );
  }

  _renderFilterList(data) {
    let sortedTags = Object.values(data).map((tag) =>
      <li key={tag.category + '-' + tag.display_name}>{tag.display_name} - {tag.num_times}</li>
    );
    return <ul>{sortedTags}</ul>
  }

  render(): React$Node {
    if(this.props.hasSubcategories) {
      return this._renderWithSubcategories();
    } else {
      return this._renderNoSubcategories();
    }
  }
}

export default RenderFilterCategory;
