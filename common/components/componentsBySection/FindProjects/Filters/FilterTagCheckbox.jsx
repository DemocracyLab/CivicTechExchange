// @flow

import React from "react";
import { Container } from "flux/utils";
import Dropdown from "react-bootstrap/Dropdown";
import GlyphStyles from "../../../utils/glyphs.js";
import type { TagDefinition } from "../../../utils/ProjectAPIUtils.js";
import UniversalDispatcher from "../../../stores/UniversalDispatcher.js";
import metrics from "../../../utils/metrics.js";
import ProjectSearchStore from "../../../stores/ProjectSearchStore.js";

type Props = {|
  tag: TagDefinition,
|};

type State = {|
  checked: boolean,
|};

// Checkbox element for selecting tag filters
class FilterTagCheckbox extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.targetRef = React.createRef();
    this.state = { isOpen: false };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State, props: Props): State {
    return {
      checked: ProjectSearchStore.isTagFilterApplied(props.tag.tag_name),
    };
  }

  toggleCheckbox(): void {
    if (!this.state.checked) {
      UniversalDispatcher.dispatch({
        type: "ADD_TAG",
        tag: this.props.tag.tag_name,
      });
      metrics.logSearchFilterByTagEvent(this.props.tag);
    } else {
      UniversalDispatcher.dispatch({
        type: "REMOVE_TAG",
        tag: this.props.tag,
      });
    }
  }

  render(): React$Node {
    const key: string = this.props.tag.tag_name;
    return (
      <Dropdown.Item eventKey={key} as="button">
        <input
          type="checkbox"
          id={key}
          checked={this.state.checked}
          onChange={this.toggleCheckbox.bind(this)}
        ></input>
        <label htmlFor={key}>
          <span>{this.props.tag.display_name}</span>
          <span>
            {this.state.checked ? (
              <i className={GlyphStyles.Check}></i>
            ) : (
              this.props.tag.num_times
            )}
          </span>
        </label>
      </Dropdown.Item>
    );
  }
}

export default Container.create(FilterTagCheckbox, { withProps: true });
