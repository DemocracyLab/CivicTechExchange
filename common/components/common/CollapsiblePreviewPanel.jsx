// @flow

import React from "react";
import GlyphStyles from "../utils/glyphs.js";

type Props = {|
  +previewContent: React$Node,
  +collapsibleContent: React$Node,
  +expanded: ?boolean,
|};

type State = {|
  +previewContent: React$Node,
  +collapsibleContent: React$Node,
  +expanded: ?boolean,
|};

// Panel that always shows preview content at the top, with content below that can be expanded or collapsed
class CollapsiblePreviewPanel extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = this.initializeState(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    this.setState(this.initializeState(nextProps));
  }

  initializeState(props: Props): State {
    return {
      previewContent: props.previewContent,
      collapsibleContent: props.collapsibleContent,
      expanded: props.expanded || false,
    };
  }

  toggleExpansion(): void {
    this.setState({ expanded: !this.state.expanded });
  }

  render(): React$Node {
    return (
      <div className="preview-panel">
        <div
          className="d-flex justify-content-between"
          onClick={this.toggleExpansion.bind(this)}
        >
          {this.state.previewContent}
          {this._renderExpandCollapse()}
        </div>
        {this.state.expanded && this.state.collapsibleContent}
      </div>
    );
  }

  _renderExpandCollapse(): React$Node {
    return (
      <React.Fragment>
        <span className="preview-panel-toggle">
          {this.state.expanded ? (
            <i className={GlyphStyles.ChevronUp}></i>
          ) : (
            <i className={GlyphStyles.ChevronDown}></i>
          )}
        </span>
      </React.Fragment>
    );
  }
}

export default CollapsiblePreviewPanel;
