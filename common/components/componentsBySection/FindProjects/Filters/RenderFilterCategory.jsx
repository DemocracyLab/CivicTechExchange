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
    // TODO: verify if we need to keep/remove the as=nav stuff (low priority)
  // TODO: menu should stay open on filter item click; may need to refactor this - can't use AutoClose prop, that's BS5/RB2  (high)
  // TODO: subcategory expand/collapse just like category expand/collapse, ie stays open until closed manually
  // TODO: Proper btn classing instead of this temporary use of secondary

  _renderWithSubcategories() {
    console.log(this.props.cdata);
    const cdata = this.props.cdata;
    const mapped = cdata.map(key => (
      <React.Fragment key={"Fragment-" + key[0]}>
        <Dropdown.Item key={key[0]} >
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
          className="btn btn-outline-secondary"
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
          className="btn btn-outline-secondary"
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
