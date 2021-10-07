// @flow

import React, { forwardRef } from "react";
import _ from "lodash";
import GlyphStyles from "../../../utils/glyphs.js";
import Dropdown from "react-bootstrap/Dropdown";
import PopOut from "../../../common/PopOut.jsx";
import FilterTagCheckbox from "./FilterTagCheckbox.jsx";
import type { TagDefinition } from "../../../utils/ProjectAPIUtils.js";
import type { TagsByCategory } from "../../../utils/tags.js";

type Props = {|
  cdata: TagsByCategory,
  displayName: string,
  hasSubcategories: boolean,
  checkEnabled: Function,
  selectOption: Function,
|};

type State = {|
  isOpen: boolean,
  openSubCategory: string,
|};

class RenderFilterCategory<T> extends React.PureComponent<Props<T>, State> {
  constructor(props: Props): void {
    super(props);
    this.targetRef = React.createRef();
    this.state = { isOpen: false };
  }
  // TODO: verify if we need to keep/remove the as=nav stuff (low priority)
  // TODO: menu should stay open on filter item click; may need to refactor this - can't use AutoClose prop, that's BS5/RB2  (high)
  // TODO: subcategory expand/collapse just like category expand/collapse, ie stays open until closed manually
  // TODO: Proper btn classing instead of this temporary use of secondary

  toggleCategory() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  hideCategory() {
    this.setState({ isOpen: false });
  }

  expandSubCategory(subcategory: string) {
    this.setState({ openSubCategory: subcategory });
  }

  _renderSubcategories(props: Props, ref: forwardRef): React$Node {
    const cdata: TagsByCategory = this.props.cdata;

    return (
      <div className="RenderFilterPopout" ref={ref}>
        <div className="SubCategoryFrame">
          {cdata.map(key => {
            const subcategory: string = key[0];
            return (
              <React.Fragment key={"Fragment-" + subcategory}>
                <Dropdown.Item
                  key={subcategory}
                  onClick={this.expandSubCategory.bind(this, subcategory)}
                >
                  <h4>{subcategory}</h4>
                </Dropdown.Item>
              </React.Fragment>
            );
          })}
        </div>
        {this.state.openSubCategory && this._renderFilters(props, ref)}
      </div>
    );
  }
  _renderFilters(props: Props, ref: forwardRef): React$Node {
    let tags: $ReadOnlyArray<TagDefinition> = this.props.cdata;
    if (this.state.openSubCategory && !_.isEmpty(this.props.cdata)) {
      const subcategoryTags: [
        string,
        $ReadOnlyArray<TagDefinition>
      ] = this.props.cdata.filter(
        (subcategorySet: [string, $ReadOnlyArray<TagDefinition>]) =>
          subcategorySet[0] === this.state.openSubCategory
      );
      tags = subcategoryTags[0][1];
    }
    return (
      <div className="RenderFilterPopout" ref={ref}>
        <div className="FilterSelectFrame">
          {tags.map(tag => (
            <FilterTagCheckbox tag={tag} />
          ))}
        </div>
      </div>
    );
  }

  render(): React$Node {
    const frameContentFunc: forwardRef = (props, ref) => {
      return this.props.hasSubcategories
        ? this._renderSubcategories(props, ref)
        : this._renderFilters(props, ref);
    };

    const sourceRef: forwardRef = React.createRef();

    return (
      <div
        className="btn btn-outline-secondary"
        id={this.props.displayName}
        onClick={this.toggleCategory.bind(this)}
        ref={this.targetRef}
      >
        <div className="DoWeNeedThis" ref={sourceRef}>
          {this.props.displayName}{" "}
          <span className="RenderFilterCategory-activecount"></span>
          <span className="RenderFilterCategory-arrow">
            <i className={GlyphStyles.ChevronDown}></i>
          </span>
        </div>
        <PopOut
          show={this.state.isOpen}
          frameRef={frameContentFunc}
          sourceRef={sourceRef}
          direction={"bottom"}
          onHide={this.hideCategory.bind(this)}
        />
      </div>
    );
  }
}

export default RenderFilterCategory;
