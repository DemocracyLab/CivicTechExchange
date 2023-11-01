// @flow
// derived from AboutGroupDisplay
import React from "react";
import { Container } from "flux/utils";
import AboutGroupDisplay from "./AboutGroupDisplay.jsx"
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import ProjectCardsContainer from "../../componentsBySection/FindProjects/ProjectCardsContainer.jsx";

class IframeGroupDisplay extends AboutGroupDisplay<Props, State> {
  render(): React$Node {
    const group: GroupDetailsAPIData = this.state.group;
    return (
      <div className="Profile-primary-section col-12 col-lg-auto flex-lg-shrink-1">
        <div className="Profile-primary-container frame-full">
          {group.group_project_count > 0 && (
            <div className="AboutGroup-card-container">
              <div className="row">
                <ProjectCardsContainer
                  showSearchControls={false}
                  suppressHeader={true}
                  staticHeaderText=""
                  fullWidth={true}
                  selectableCards={false}
                  handleEmptyProject={() => {}}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Container.create(IframeGroupDisplay, { pure: false });