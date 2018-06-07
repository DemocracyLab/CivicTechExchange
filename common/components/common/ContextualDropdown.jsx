// @flow

import React from 'react';
import _ from 'lodash';

type Props = {|
  showContextualArrow: ?boolean,
  children: React$Node,
  xPos: number,
  yPos: ?number
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
    const style = _.pickBy({
      left: this.props.xPos,
      top: this.props.yPos
    },_.identity);
    
    return (
      <div
        className="ContextualDropdown-root"
        ref={this._onDropDownMount.bind(this)}
        style={style}>
        {this.props.showContextualArrow ? this._renderContextualArrow() : null}
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
