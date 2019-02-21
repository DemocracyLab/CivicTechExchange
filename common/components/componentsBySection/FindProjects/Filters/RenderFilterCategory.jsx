// @flow

import React from 'react';
import _ from 'lodash';

const categoryDisplayNames = {
  //TODO: move to global constants file
  'Issue(s) Addressed': "Issue Areas",
  'Role': "Roles Needed",
}

class RenderFilterCategory<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super(props);
  }

  _displayName(input) {
    //TODO: Refactor this to take (input, list) so we can feed different const values to it so it's utility, move to utility js, use it here and for LinkList
    //replaces specified database-generated names to chosen display names
    return categoryDisplayNames[input] || input;
  }


  _renderWithSubcategories() {
    //if hasSubcategories is true, we need to group, sort, and render each subcategory much like categories are sorted and rendered in the parent component
    //group by subcategories, then sort and map just like parent component but for subcategories
    let groupedSubcats = _.groupBy(this.props.data, 'subcategory');
    let sortedKeys = Object.keys(groupedSubcats).sort(); //default sort is alphabetical, what we want

    const displaySubcategories = sortedKeys.map(key =>
          <div className="ProjectFilterContainer-subcategory">
            <div className="ProjectFilterContainer-subcategory-header"><span>{key}</span><span>{_.sumBy(groupedSubcats[key], 'num_times')}</span></div>
            {this._renderFilterList(groupedSubcats[key])}
          </div>
        );
      return (
        <div className="ProjectFilterContainer-category">
          <div className="ProjectFilterContainer-category-header">{this._displayName(this.props.category)}</div>
          {displaySubcategories}
        </div>
      )
  }
  _renderNoSubcategories() {
    //if a category has NO subcategories (hasSubcategories is false), render a single list
    return (
        <div className="ProjectFilterContainer-category">
          <h2 className="ProjectFilterContainer-category-header">{this._displayName(this.props.category)}</h2>
          {this._renderFilterList(this.props.data)}
        </div>
    );
  }

  _renderFilterList(data) {
    //this function renders individual clickable filter items regardless of category or subcategory status
    let sortedTags = Object.values(data).map((tag) =>
      <li key={tag.category + '-' + tag.display_name} className="ProjectFilterContainer-list-item">
        <label>
          <input type="checkbox" checked={this.props.checkEnabled(tag)} onChange={() => this.props.selectOption(tag)}></input>
          <span className="ProjectFilterContainer-list-item-name">{tag.display_name}</span> <span className="ProjectFilterContainer-list-item-count">{tag.num_times}</span>
        </label>
      </li>
    );
    return <ul className="ProjectFilterContainer-filter-list">{sortedTags}</ul>
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
