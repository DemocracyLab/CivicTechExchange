// @flow

import React from "react";
import _ from "lodash";

type Props = {|
  stepCount: number,
  currentlySelected: number,
|};

/**
 * Generic Modal designed to solicit feedback
 */
class StepIndicatorBars extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
  }

  render(): React$Node {
    return (
      <div className="step-bars">
        {_.range(this.props.stepCount).map((step: number) =>
          this._renderStepBar(step)
        )}
      </div>
    );
  }

  _renderStepBar(idx: number): React$Node {
    return (
      <div
        key={idx}
        className={
          "step-bar" + (this.props.currentlySelected === idx ? " selected" : "")
        }
      />
    );
  }
}

export default StepIndicatorBars;
