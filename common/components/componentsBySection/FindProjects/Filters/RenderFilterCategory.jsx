// @flow

import React from "react";
import _ from "lodash";
import GlyphStyles from "../../../utils/glyphs.js";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";

class RenderFilterCategory<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super(props);
  }
  //what I need is an item with the key name, a list of subcategories, each item has a second list of filter items
  // will probably need custom  dropdown handler but first get them rendering and get the checkbox function restored
  // map inside a map? spread operator?
  // access the list by using cdata[idx][1] -- cdata[idx][0] is subcat name
  // TODO: verify if we need to keep/remove the as=nav stuff
  _renderWithSubcategories() {
    console.log(this.props.cdata);
    const cdata = this.props.cdata;
    const mapped = cdata.map(([key], index) => (
      <Dropdown.Item>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" id={key} as={Nav.Link}>
            {key}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {cdata[index][1].forEach(el => (
              <li>{el.display_name}</li>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Dropdown.Item>
    ));
    return (
      <Dropdown as={Nav.Item}>
        <Dropdown.Toggle
          variant="outline-secondary"
          id={this.props.displayName}
          as={Nav.Link}
        >
          {this.props.displayName}{" "}
          <span className="RenderFilterCategory-activecount"></span>
          <span className="RenderFilterCategory-arrow">
            <i className={GlyphStyles.ChevronDown}></i>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>{mapped}</Dropdown.Menu>
      </Dropdown>
    );
  }
  _renderNoSubcategories() {
    const cdata = this.props.cdata;
    const mapped = cdata.map(key => (
      <Dropdown.Item>
        <input
          type="checkbox"
          id={key}
          checked={this.props.checkEnabled(key)}
          onChange={() => this.props.selectOption(key)}
        ></input>
        <label htmlFor={key}>
          <span>{key.display_name}</span>
          <span>
            {this.props.checkEnabled(key) ? (
              <i className={GlyphStyles.Check}></i>
            ) : (
              key.num_times
            )}
          </span>
        </label>
      </Dropdown.Item>
    ));
    return (
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-secondary"
          id={this.props.displayName}
          as={Nav.Link}
        >
          {this.props.displayName}{" "}
          <span className="RenderFilterCategory-activecount"></span>
          <span className="RenderFilterCategory-arrow">
            <i className={GlyphStyles.ChevronDown}></i>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>{mapped}</Dropdown.Menu>
      </Dropdown>
    );
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
