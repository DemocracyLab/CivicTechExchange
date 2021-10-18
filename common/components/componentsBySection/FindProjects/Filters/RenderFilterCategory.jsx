// @flow

import React, { forwardRef } from "react";
import { Container } from "flux/utils";
import _ from "lodash";
import GlyphStyles from "../../../utils/glyphs.js";
import Dropdown from "react-bootstrap/Dropdown";
import PopOut from "../../../common/popout/PopOut.jsx";
import FilterTagCheckbox from "./FilterTagCheckbox.jsx";
import type { TagDefinition } from "../../../utils/ProjectAPIUtils.js";
import ProjectSearchStore from "../../../stores/ProjectSearchStore.js";

type Props = {|
  category: string,
  displayName: string,
  hasSubcategories: boolean,
  isMobileLayout: boolean,
|};

type State = {|
  isOpen: boolean,
  tags: $ReadOnlyArray<[string, TagDefinition]> | $ReadOnlyArray<TagDefinition>,
  openSubCategory: string,
|};

class RenderFilterCategory<T> extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.targetRef = React.createRef();
    this.state = { isOpen: false };
  }
  // TODO: verify if we need to keep/remove the as=nav stuff (low priority)
  // TODO: menu should stay open on filter item click; may need to refactor this - can't use AutoClose prop, that's BS5/RB2  (high)
  // TODO: subcategory expand/collapse just like category expand/collapse, ie stays open until closed manually
  // TODO: Proper btn classing instead of this temporary use of secondary

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State, props: Props): State {
    return {
      tags: ProjectSearchStore.getSortedCategoryTags(props.category).toArray(),
    };
  }

  toggleCategory() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  hideCategory() {
    this.setState({ isOpen: false });
  }

  expandSubCategory(subcategory: string) {
    const openSubCategory: string =
      this.state.openSubCategory === subcategory ? "" : subcategory;
    this.setState({ openSubCategory: openSubCategory });
  }

  _renderDesktopSubcategories(props: Props, ref: forwardRef): React$Node {
    return (
      <div className="RenderFilterPopout" ref={ref}>
        <div className="SubCategoryFrame">
          {this.state.tags.map((subcategorySet: [string, TagDefinition]) => {
            const subcategory: string = subcategorySet[0];
            const className: string =
              subcategory === this.state.openSubCategory
                ? "subcategory-open"
                : "";
            return (
              <React.Fragment key={"Fragment-" + subcategory}>
                <Dropdown.Item
                  className={className}
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
  _renderMobileSubcategories(props: Props, ref: forwardRef): React$Node {
    return (
      <div className="RenderFilterPopout" ref={ref}>
        <div className="SubCategoryFrame">
          {this.state.tags.map((subcategorySet: [string, TagDefinition]) => {
            const subcategory: string = subcategorySet[0];
            const className: string =
              subcategory === this.state.openSubCategory
                ? "subcategory-open"
                : "";
            return (
              <React.Fragment key={"Fragment-" + subcategory}>
                <Dropdown.Item
                  className={className}
                  key={subcategory}
                  onClick={this.expandSubCategory.bind(this, subcategory)}
                >
                  <h4>{subcategory}</h4>
                </Dropdown.Item>
                {this.state.openSubCategory === subcategory &&
                  this._renderFilters(props, ref)}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
  _renderFilters(props: Props, ref: forwardRef): React$Node {
    let tags: $ReadOnlyArray<TagDefinition> = this.state.tags;
    if (this.state.openSubCategory && !_.isEmpty(tags)) {
      const subcategoryTags: [
        string,
        $ReadOnlyArray<TagDefinition>
      ] = this.state.tags.filter(
        (subcategorySet: [string, $ReadOnlyArray<TagDefinition>]) =>
          subcategorySet[0] === this.state.openSubCategory
      );
      tags = subcategoryTags[0][1];
    }
    const refAttribute = ref ? { ref: ref } : {};
    return (
      <div className="RenderFilterPopout" {...refAttribute}>
        <div className="FilterSelectFrame">
          {tags.map(tag => (
            <FilterTagCheckbox tag={tag} />
          ))}
        </div>
      </div>
    );
  }

  _renderDesktop(): React$Node {
    const frameContentFunc: forwardRef = (props, ref) => {
      return this.props.hasSubcategories
        ? this._renderDesktopSubcategories(props, ref)
        : this._renderFilters(props, ref);
    };

    const sourceRef: forwardRef = React.createRef();
    const className: string = this.state.isOpen ? "category-open" : "";

    return (
      <div
        className="btn btn-outline-secondary"
        id={this.props.displayName}
        ref={this.targetRef}
      >
        <div
          className={className}
          ref={sourceRef}
          onClick={this.toggleCategory.bind(this)}
        >
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

  _renderMobile(): React$Node {
    const className: string = this.state.isOpen ? "category-open" : "";
    return (
      <React.Fragment>
        <div className={className} onClick={this.toggleCategory.bind(this)}>
          {this.props.displayName}{" "}
          <span className="RenderFilterCategory-activecount"></span>
          <span className="RenderFilterCategory-arrow">
            <i className={GlyphStyles.ChevronDown}></i>
          </span>
        </div>
        {this.state.isOpen &&
          (this.props.hasSubcategories
            ? this._renderMobileSubcategories()
            : this._renderFilters())}
      </React.Fragment>
    );
  }

  render(): React$Node {
    return this.props.isMobileLayout
      ? this._renderMobile()
      : this._renderDesktop();
  }
}

export default Container.create(RenderFilterCategory, { withProps: true });
