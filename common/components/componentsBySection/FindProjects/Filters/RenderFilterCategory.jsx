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
  //what I need is an item with the key name, and a sub-dropdown with all the values so something like dropdown, dropdownmenu (each item being a new dropdown dropright?)
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
          {this.props.displayName}
        </Dropdown.Toggle>
        <Dropdown.Menu>{mapped}</Dropdown.Menu>
      </Dropdown>
    );
  }
  _renderNoSubcategories() {
    const cdata = this.props.cdata;
    const mapped = cdata.map(key => (
      <Dropdown.Item>{key.display_name}</Dropdown.Item>
    ));
    return (
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-secondary"
          id={this.props.displayName}
          as={Nav.Link}
        >
          {this.props.displayName}
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
