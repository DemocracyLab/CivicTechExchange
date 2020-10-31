// @flow

import React from 'react';

type Props = {|
  id: string,
  value: boolean,
  onCheck: (boolean) => void
|};

// Checkbox wrapper that harmonizes with django's form handling
class CheckBox extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super();
  }
  
  _onCheck(event: SyntheticInputEvent<HTMLInputElement>): void {
    const checkValue: boolean = event.target.checked;
    this.props.onCheck(checkValue);
  }

  render(): ?React$Node {
    return (
      <React.Fragment>
        <input
          type="hidden"
          id={this.props.id}
          name={this.props.id}
          value={this.props.value ? "on" : "off"}
        />
        <input
          type="checkbox"
          checked={this.props.value}
          onChange={this._onCheck.bind(this)}
        />
      </React.Fragment>
    );
  }
}

export default CheckBox;
