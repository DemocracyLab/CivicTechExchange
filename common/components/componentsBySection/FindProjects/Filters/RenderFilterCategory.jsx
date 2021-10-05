// @flow

import React, { forwardRef } from "react";
import _ from "lodash";
import GlyphStyles from "../../../utils/glyphs.js";
import Dropdown from "react-bootstrap/Dropdown";
import PopOut from "../../../common/PopOut.jsx";

type Props = {|
  cdata: object,
  displayName: string,
  hasSubcategories: boolean,
  checkEnabled: Function,
  selectOption: Function,
|};

type State = {|
  isOpen: boolean,
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

  _renderContentWithSubcategories(props: Props, ref: forwardRef): React$Node {
    console.log(this.props.cdata);
    const cdata = this.props.cdata;
    return (
      <div ref={ref}>
        {cdata.map(key => (
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
        ))}
      </div>
    );
  }
  _renderContentNoSubcategories(props: Props, ref: forwardRef): React$Node {
    const cdata = this.props.cdata;
    return (
      <div ref={ref}>
        {cdata.map(key => (
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
        ))}
      </div>
    );
  }

  render(): React$Node {
    const frameContentFunc: forwardRef = (props, ref) => {
      return this.props.hasSubcategories
        ? this._renderContentWithSubcategories(props, ref)
        : this._renderContentNoSubcategories(props, ref);
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
