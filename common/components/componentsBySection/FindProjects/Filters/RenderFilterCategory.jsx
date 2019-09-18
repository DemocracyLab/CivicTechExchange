// @flow

import React from 'react';
import _ from 'lodash';
import GlyphStyles from '../../../utils/glyphs.js'
import metrics from "../../../utils/metrics";
import ProjectSearchDispatcher from "../../../stores/ProjectSearchDispatcher.js";


const categoryDisplayNames = {
  //TODO: move to global constants file
  'Issue(s) Addressed': "Issue Areas",
  'Role': "Roles Needed",
}

//define CSS classes, keep it readable
const classCategoryExpanded = 'ProjectFilterContainer-category ProjectFilterContainer-expanded';
const classCategoryCollapsed = 'ProjectFilterContainer-category ProjectFilterContainer-collapsed';
const classSubcategoryExpanded = 'ProjectFilterContainer-subcategory ProjectFilterContainer-expanded';
const classSubcategoryCollapsed = 'ProjectFilterContainer-subcategory ProjectFilterContainer-collapsed';

class RenderFilterCategory<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super(props)
    // This constructor creates state keys based on category or subcategory - each state key/value will indicate whether or not a given (sub)category is expanded (true) or collapsed (false)
    // because this component is reused we have to dynamically generate key names here.

    //get list of category keys to set initial state (for collapse/expand), then set all as false (collapsed)
    //TODO: this is very similar to constructor for parent component - find a way to do or write this once, not twice
    let c = Object.keys(_.groupBy(this.props.data, 'category')) || [] ;
    let s = Object.keys(_.groupBy(this.props.data, 'subcategory')) || [];
    let cs = _.concat(c, s);
    //cs is now an array of each key we want to use for expand/collapse category state
    //make an object and push in each key from cs, set all values to false
    const collector = {}
    for (var key in cs) {
      let val = cs[key]
      collector[val] = false;
    }
    //now create an object for individual filter selected/unselected state
    const tagNames = {}
    const tdata = this.props.data
    for (var i = 0; i < tdata.length; i++) {
      var kname = tdata[i].tag_name;
      tagNames[kname] = false
    }
    //merge these two objects before creating state
    let combined = _.merge(collector, tagNames)

    //set initial state
    this.state = combined || {}

    this._handleChange = this._handleChange.bind(this);
  }

  //handle expand/collapse
  _handleChange(name, event) {
    event.preventDefault();
    event.stopPropagation();
    const value = this.state[name];
    this.setState({
      [name]: !value
    });
  }

  _displayName(input) {
    //replaces specified database-generated names with chosen display names; if there is no replacement specified, return input unchanged
    return categoryDisplayNames[input] || input;
  }

  _renderWithSubcategories() {
    //if hasSubcategories is true, we need to group, sort, and render each subcategory much like categories are sorted and rendered in the parent component

    //group by subcategories, then sort and map just like parent component but for subcategories
    let groupedSubcats = _.groupBy(this.props.data, 'subcategory');
    let sortedKeys = Object.keys(groupedSubcats).sort(); //default sort is alphabetical, what we want
    let categoryKey = this.props.category; //for the whole category's container element
    const displaySubcategories = sortedKeys.map(key =>
          <div className={this.state[key] ? classSubcategoryExpanded : classSubcategoryCollapsed} key={key}>
            <div className="ProjectFilterContainer-subcategory-header"  id={key} onClick={(e) => this._handleChange(key, e)}>
              <span>{key}</span><span className="ProjectFilterContainer-showtext">{this.state[key] ? <i className={GlyphStyles.ChevronUp}></i> : <i className={GlyphStyles.ChevronDown}></i>}</span>
            </div>
            <div className="ProjectFilterContainer-content">
              {this._renderFilterList(groupedSubcats[key])}
            </div>
          </div>
        );
      return (
        <div className={this.state[categoryKey] ? classCategoryExpanded : classCategoryCollapsed} key={categoryKey}>
          <div className="ProjectFilterContainer-category-header" id={this.props.category} onClick={(e) => this._handleChange(categoryKey, e)}>
            <span>{this._displayName(this.props.category)}</span>
            <span className="ProjectFilterContainer-showtext">{this.state[categoryKey] ? <i className={GlyphStyles.ChevronUp}></i> : <i className={GlyphStyles.ChevronDown}></i>}</span>
          </div>
          <div className="ProjectFilterContainer-content">
            {displaySubcategories}
          </div>
        </div>
      )
  }
  _renderNoSubcategories() {
    let categoryKey = this.props.category;
    //if a category has NO subcategories (hasSubcategories is false), render a single list
    return (
        <div className={this.state[categoryKey] ? classCategoryExpanded : classCategoryCollapsed}>
          <div className='ProjectFilterContainer-category-header' id={categoryKey} onClick={(e) => this._handleChange(categoryKey, e)}>
            <span>{this._displayName(this.props.category)}</span>
            <span className="ProjectFilterContainer-showtext">{this.state[categoryKey] ? <i className={GlyphStyles.ChevronUp}></i> : <i className={GlyphStyles.ChevronDown}></i>}</span>
          </div>
          <div className="ProjectFilterContainer-content">
            {this._renderFilterList(this.props.data)}
          </div>
        </div>
    );
  }

  _renderFilterList(data) {
    //this function renders individual clickable filter items regardless of category or subcategory status
    let sortedTags = Object.values(data).map(tag => {
      const key:string = tag.category + '-' + tag.tag_name;
      return  (
                <li key={key} className="ProjectFilterContainer-list-item">
                  <input type="checkbox" id={key} checked={this.state[tag.tag_name]} onChange={() => this.selectOption(tag)}></input>
                  <label htmlFor={key}>
                    <span className="ProjectFilterContainer-list-item-name">{tag.display_name}</span> <span className="ProjectFilterContainer-list-item-count">{this.state[tag.tag_name] ? <i className={GlyphStyles.Check}></i> : tag.num_times}</span>
                  </label>
                </li>
            )
      });

    return <ul className="ProjectFilterContainer-filter-list">{sortedTags}</ul>
  }

  selectOption(tag): void {
    var tagInState = this.state[tag.tag_name]
    //if tag is NOT currently in state, add it, otherwise remove
    if(!tagInState) {
      ProjectSearchDispatcher.dispatch({
        type: 'ADD_TAG',
        tag: tag.tag_name,
      });
      this.setState({[tag.tag_name]: true})
      metrics.logSearchFilterByTagEvent(tag);
    } else {
      ProjectSearchDispatcher.dispatch({
        type: 'REMOVE_TAG',
        tag: tag,
      });
      this.setState({[tag.tag_name]: false})
    }
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
