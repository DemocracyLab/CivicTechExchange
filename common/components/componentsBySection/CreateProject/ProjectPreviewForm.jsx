// @flow

import React from "react";
import type {ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import AboutProjectDisplay from "../../common/projects/AboutProjectDisplay.jsx";

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: () => () => boolean
|};

/**
 * Shows preview for project before finalizing
 */
class ProjectPreviewForm extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
    props.readyForSubmit && props.readyForSubmit(true);
  }

  render(): React$Node {
    return (
      <AboutProjectDisplay
        project={this.props.project}
        viewOnly={true}
      />
    );
  }
}

export default ProjectPreviewForm;
