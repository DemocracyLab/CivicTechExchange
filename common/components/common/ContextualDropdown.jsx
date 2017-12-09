// @flow

import React from 'react';

type Props = {|
  children: React$Node,
  xPos: number,
|};
type State = {|
  contextualArrowX: number,
|};

class ContextualDropdown extends React.PureComponent<Props, State> {

  constructor(): void {
    super();
    this.state = {
      contextualArrowX: 0,
    };
  }

  render(): React$Node {
    return (
      <div
        className="ContextualDropdown-root"
        ref={this._onDropDownMount.bind(this)}
        style={{left: this.props.xPos}}>
        {this._renderContextualArrow()}
        {this.props.children}
      </div>
    );
  }

  _onDropDownMount(dropDownElement: ?React$ElementRef<*>): void {
    const contextualArrowX = dropDownElement
      ? dropDownElement.getBoundingClientRect().width / 2
      : 0;
    this.setState({contextualArrowX});
  }

  _renderContextualArrow(): React$Node {
    return (
      <div
        className="ContextualDropdown-contextualArrow"
        style={{left: this.state.contextualArrowX}}
      />
    );
  }
}

export default ContextualDropdown;
