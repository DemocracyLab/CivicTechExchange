// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import {OnReadySubmitFunc} from "./EventFormCommon.jsx";
import AboutEventDisplay from "./AboutEventDisplay.jsx";

type Props = {|
  event: ?ProjectDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc
|};

/**
 * Shows preview for project before finalizing
 */
class ProjectPreviewForm extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
    // All fields optional
    props.readyForSubmit(true);
  }

  render(): React$Node {
    
    return (
      <React.Fragment>
        <DjangoCSRFToken/>
        <input type="hidden" name="is_searchable" value="True"/>
        <AboutEventDisplay
          event={this.props.project}
          viewOnly={true}
        />
      </React.Fragment>
    );
  }
}

export default ProjectPreviewForm;
