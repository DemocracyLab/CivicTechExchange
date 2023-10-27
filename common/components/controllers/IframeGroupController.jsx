// @flow
import React from "react";
import AboutGroupController from "./AboutGroupController.jsx";
import IframeGroupDisplay from "../common/groups/IframeGroupDisplay.jsx";

export default class IframeGroupController extends AboutGroupController<{||}, State> {
  _renderDetails(): React$Node {
    return (
      <React.Fragment>
        <IframeGroupDisplay group={this.state.group} viewOnly={false} />
      </React.Fragment>
    );
  }
}

