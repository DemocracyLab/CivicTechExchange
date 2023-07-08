// @flow

import React from "react";

import type { ProjectDetailsAPIData } from "../utils/ProjectAPIUtils.js";
import AboutProjectController from "./AboutProjectController.jsx"
import IframeProjectDisplay from "../common/projects/IframeProjectDisplay.jsx";

class IframeProjectController extends AboutProjectController<{||}, State> {

    _renderDetails(): React$Node {
        return (
          <React.Fragment>
            <IframeProjectDisplay project={this.state.project} viewOnly={false} />
          </React.Fragment>
        );
      }
} 

export default IframeProjectController
