// @flow

import React from "react";
import _ from "lodash";
import GlyphStyles from "../../../utils/glyphs.js";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";

const categoryDisplayNames = {
  //TODO: move to global constants file
  "Issue(s) Addressed": "Issue Areas",
  Role: "Roles Needed",
  Organization: "Events & Groups",
};

//define CSS classes, keep it readable
class RenderFilterCategory<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super(props);
    // This constructor creates state keys based on category or subcategory - each state key/value will indicate whether or not a given (sub)category is expanded (true) or collapsed (false)
    // because this component is reused we have to dynamically generate key names here.

    //get list of category keys to set initial state (for collapse/expand), then set all as false (collapsed)
    //TODO: this is very similar to constructor for parent component - find a way to do or write this once, not twice
    let c = Object.keys(_.groupBy(this.props.data, "category")) || [];
    let s = Object.keys(_.groupBy(this.props.data, "subcategory")) || [];
    let cs = _.concat(c, s);
    //cs is now an array of each key we want to use for expand/collapse tracking

    //make an object and push in each key from cs, set all values to false
    const collector = {};
    for (var key in cs) {
      let val = cs[key];
      collector[val] = false;
    }
    //set initial state once collector is populated
    this.state = collector || {};
  }

  _displayName(input) {
    //replaces specified database-generated names with chosen display names; if there is no replacement specified, return input unchanged
    return categoryDisplayNames[input] || input;
  }

  _renderWithSubcategories() {
    //if hasSubcategories is true, we need to group, sort, and render each subcategory much like categories are sorted and rendered in the parent component

    //group by subcategories, then sort and map just like parent component but for subcategories
    let groupedSubcats = _.groupBy(this.props.data, "subcategory");
    let sortedKeys = Object.keys(groupedSubcats).sort(); //default sort is alphabetical, what we want
    let categoryKey = this.props.category; //for the whole category's container element
    const displaySubcategories = sortedKeys.map(key => (
      <div
        className={
          this.state[key] ? classSubcategoryExpanded : classSubcategoryCollapsed
        }
        key={key}
      >
        <span>{key}</span>
        <div className="ProjectFilterContainer-content">
          {this._renderFilterList(groupedSubcats[key])}
        </div>
      </div>
    ));
    return (
      <Dropdown as={NavItem} key={categoryKey} id={this.props.category}>
        <Dropdown.Toggle as={Nav.Link}>
          {this._displayName(this.props.category)}
        </Dropdown.Toggle>
        <Dropdown.Menu>{displaySubcategories}</Dropdown.Menu>
      </Dropdown>
    );
  }
  _renderNoSubcategories() {
    let categoryKey = this.props.category;
    //if a category has NO subcategories (hasSubcategories is false), render a single list
    return (
      <Dropdown as={NavItem} key={categoryKey} id={this.props.category}>
        <Dropdown.Toggle as={NavLink}>{categoryKey}</Dropdown.Toggle>
        <Dropdown.Menu>{this._renderFilterList(this.props.data)}</Dropdown.Menu>
      </Dropdown>
    );
  }

  _renderFilterList(data) {
    //this function renders individual clickable filter items regardless of category or subcategory status
    let sortedTags = Object.values(data).map(tag => {
      const key: string = tag.category + "-" + tag.tag_name;
      return (
        <Dropdown.Item key={key}>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                id={key}
                checked={this.props.checkEnabled(tag)}
                onChange={() => this.props.selectOption(tag)}
              ></input>
              {tag.display_name}{" "}
              <span className="ProjectFilterContainer-list-item-count">
                {this.props.checkEnabled(tag) ? (
                  <i className={GlyphStyles.Check}></i>
                ) : (
                  tag.num_times
                )}
              </span>
            </label>
          </div>
        </Dropdown.Item>
      );
    });

    return <React.Fragment>{sortedTags}</React.Fragment>;
  }

  render(): React$Node {
    if (this.props.hasSubcategories) {
      return this._renderWithSubcategories();
    } else {
      return this._renderNoSubcategories();
    }
  }
}

export default RenderFilterCategory;
