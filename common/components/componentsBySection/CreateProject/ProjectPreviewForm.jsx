// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import type {ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import AboutProjectDisplay from "../../common/projects/AboutProjectDisplay.jsx";
import {OnReadySubmitFunc} from "./ProjectFormCommon.jsx";

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc
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
      <React.Fragment>
        <DjangoCSRFToken/>
        <input type="hidden" name="is_created" value="True"/>
        <AboutProjectDisplay
          project={this.props.project}
          viewOnly={true}
        />
      </React.Fragment>
    );
  }
}

export default ProjectPreviewForm;
