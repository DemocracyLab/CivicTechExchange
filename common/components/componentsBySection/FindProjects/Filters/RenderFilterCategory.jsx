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
    super(props)
    //get list of category keys to set initial state (for collapse/expand), then set all as false (collapsed)
    //TODO: this is very similar to constructor for parent component - find a way to do or write this once, not twice
    let c = Object.keys(_.groupBy(this.props.data, 'category')) || [] ;
    let s = Object.keys(_.groupBy(this.props.data, 'subcategory')) || [];
    let cs = _.concat(c, s);
    //cs is now an array of each key we want to use for expand/collapse tracking

    //make an object and push in each key set to false
    const collector = {}
    for (var key in cs) {
      let val = cs[key]
      collector[val] = false;
    }
    //set initial state once collector is populated
    this.state = collector || {}

    this._handleChange = this._handleChange.bind(this);
    this._selectClassName = this._selectClassName.bind(this);
  }

  //handle expand/collapse
  _handleChange(name, event) {
    this.setState(prevState => ({
      name: !prevState.name
    }));
    console.log(name);
  }

  _displayName(input) {
    //TODO: Refactor this to take (input, list) so we can feed different const values to it so it's utility, move to utility js, use it here and for LinkList
    //replaces specified database-generated names to chosen display names
    return categoryDisplayNames[input] || input;
  }

  _selectClassName(key) {
    let subcategoryClassName = 'ProjectFilterContainer-subcategory';
      if (this.state[key]) {
        subcategoryClassName += ' ProjectFilterContainer-expanded';
      } else {
        subcategoryClassName += ' ProjectFilterContainer-collapsed';
      }
     return subcategoryClassName;
  }


  _renderWithSubcategories() {
    //if hasSubcategories is true, we need to group, sort, and render each subcategory much like categories are sorted and rendered in the parent component
    //group by subcategories, then sort and map just like parent component but for subcategories
    let groupedSubcats = _.groupBy(this.props.data, 'subcategory');
    let sortedKeys = Object.keys(groupedSubcats).sort(); //default sort is alphabetical, what we want

    const displaySubcategories = sortedKeys.map(key =>
          <div className={this._selectClassName(key)} key={key}>
            <div className="ProjectFilterContainer-subcategory-header" id={key} onClick={(e) => this._handleChange(key, e)}>
              <span>{key}</span><span>{_.sumBy(groupedSubcats[key], 'num_times')}</span>
            </div>
            {this._renderFilterList(groupedSubcats[key])}
          </div>
        );
      return (
        <div className="ProjectFilterContainer-category" key={this.props.category}>
          <div className="ProjectFilterContainer-category-header" id={this.props.category} onClick={this._handleChange}>
            {this._displayName(this.props.category)}</div>
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
          <input type="checkbox" id={tag.category + '-' + tag.display_name} checked={this.props.checkEnabled(tag)} onChange={() => this.props.selectOption(tag)}></input>
          <label htmlFor={tag.category + '-' + tag.display_name}>
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
