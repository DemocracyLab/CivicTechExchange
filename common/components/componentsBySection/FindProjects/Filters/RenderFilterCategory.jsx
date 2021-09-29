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
  // data structure is a lot of nested arrays, so the render is a bit of a mess
  // TODO: verify if we need to keep/remove the as=nav stuff
  // TODO: menu should stay open on filter item click; may need to refactor this (check dropdown docs, might need to use MenuItem directly? --
  // something like <Dropdown><Input fn><Dropdown.Menu> then mapped MenuItems instead of Dropdown.Items?

  _renderWithSubcategories() {
    console.log(this.props.cdata);
    const cdata = this.props.cdata;
    const mapped = cdata.map(key => (
      <React.Fragment key={"Fragment-" + key[0]}>
        <Dropdown.Item key={key[0]}>
          <h4>{key[0]}</h4>
        </Dropdown.Item>

        {key[1].map(subkey => (
          <Dropdown.Item eventKey={subkey.tag_name} as="button">
            <input
              type="checkbox"
              id={subkey.tag_name}
              checked={this.props.checkEnabled(subkey)}
              onChange={() => this.props.selectOption(subkey)}
            ></input>
            <label htmlFor={subkey.tag_name}>
              <span>{subkey.display_name}</span>
              <span>
                {this.props.checkEnabled(subkey) ? (
                  <i className={GlyphStyles.Check}></i>
                ) : (
                  subkey.num_times
                )}
              </span>
            </label>
          </Dropdown.Item>
        ))}
      </React.Fragment>
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
  _renderNoSubcategories() {
    const cdata = this.props.cdata;
    const mapped = cdata.map(key => (
      <Dropdown.Item eventKey={key.tag_name} as="button">
        <input
          type="checkbox"
          id={key[0]}
          checked={this.props.checkEnabled(key)}
          onChange={() => this.props.selectOption(key)}
        ></input>
        <label htmlFor={key[0]}>
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
