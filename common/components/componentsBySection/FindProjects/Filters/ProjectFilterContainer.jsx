// @flow
import React from "react";
import ProjectFilterDataContainer from "./ProjectFilterDataContainer.jsx";
import ResetSearchButton from "../ResetSearchButton.jsx";
import EnableAlertButton from "../EnableAlertButton.jsx";
import metrics from "../../../utils/metrics.js";
import AlertSignupModal from "../AlertSignupModal.jsx";

class ProjectFilterContainer<T> extends React.PureComponent<Props<T>, State> {
  render(): React$Node {
    return (
      <div className="ProjectFilterContainer-root col-12 col-md-4 col-lg-3 pl-0 pr-0">
        <div className="ProjectFilterContainer-reset">
          <ResetSearchButton />
        </div>
        <ProjectFilterDataContainer />
        <div>
        </div>
        {/* <AlertSignupModal /> */}
        <EnableAlertButton />
      </div>
    );
  }
}

export default ProjectFilterContainer;
