// @flow

import React from 'react'

type Props = {|
  elementId: string,
  maxLength: string
|};
type State = {|
  characterCount: string
|};

// TODO: Consider whether we need this in a controlled components environment
class CharacterCounter extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
  }
  
  componentDidMount(): void {
    var component = this;
    
    this.refreshElementCharacterCount();
    var input = document.getElementById(this.props.elementId);
    // add onclick event
    if(input) {
      input.addEventListener("input", function () {
        component.refreshElementCharacterCount();
      });
    }
  }
  
  refreshElementCharacterCount(): void {
    var input = document.getElementById(this.props.elementId);
    if (input && input.value && input.value.length) {
      this.setState({characterCount: String(input.value.length)});
    }
  }
  
  render(): React$Node {
    return (
      <div className="character-count">
        {this.state ? this.state.characterCount : 0} / {this.props.maxLength}
      </div>
    );
  }
}

export default CharacterCounter;
