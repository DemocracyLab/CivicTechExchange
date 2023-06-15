// @flow

import React from "react";
import Truncate from "../utils/truncate.js";

type Props = {|
  +text: string,
  +expanded: ?boolean,
  +maxCharacters: number,
  +maxLines: number,
|};

type State = {|
  +collapsedText: string,
  +collapsible: boolean,
  +expanded: boolean,
|};

class CollapsibleTextSection extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = this.initializeState(props);
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return this.initializeState(nextProps);
  }

  initializeState(props: Props): State {
    const collapsedText: string = this.getCollapsedText(props.text);
    return {
      collapsedText: collapsedText,
      collapsible: collapsedText !== props.text,
      expanded: props.expanded || false,
    };
  }

  toggleExpansion(): void {
    this.setState({ expanded: !this.state.expanded });
  }

  render(): React$Node {
    return (
      <div>
        {this.state.expanded ? this.props.text : this.state.collapsedText}
        {this.state.collapsible ? this._renderExpandCollapse() : null}
      </div>
    );
  }

  _renderExpandCollapse(): React$Node {
    return (
      <span
        className="expand-toggle"
        onClick={this.toggleExpansion.bind(this)}
        style={{ paddingLeft: "10px" }}
      >
        {this.state.expanded ? "Read Less" : "Read More"}
      </span>
    );
  }

  getCollapsedText(text: string): string {
    let collapsedText: string = Truncate.stringT(
      this.props.text,
      this.props.maxCharacters
    );
    collapsedText = Truncate.lines(collapsedText, this.props.maxLines);
    return collapsedText;
  }
}

export default CollapsibleTextSection;
