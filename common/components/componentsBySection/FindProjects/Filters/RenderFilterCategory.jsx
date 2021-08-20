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

  _renderWithSubcategories() {
    return (
      <React.Fragment>
        <p>
          {this.props.displayName}/{this.props.hasSubcategories.toString()}
        </p>
      </React.Fragment>
    )
  }
  _renderNoSubcategories() {
    const cdata = this.props.cdata;
    const mapped = cdata.map(key => <li>{key.display_name}</li>);
    return <ul>{mapped}</ul>
  }

  render(): React$Node {
    if (this.props.hasSubcategories) {
      this._renderWithSubcategories();
    } else {
      this._renderNoSubcategories();
    }
  }
}

export default RenderFilterCategory;
