// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import { OnReadySubmitFunc } from "./EventFormCommon.jsx";
import AboutEventDisplay from "./AboutEventDisplay.jsx";
import type { EventData } from "../../utils/EventAPIUtils.js";

type Props = {|
  project: ?EventData,
  readyForSubmit: OnReadySubmitFunc,
|};

/**
 * Shows preview for project before finalizing
 */
class EventPreviewForm extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
    // All fields optional
    props.readyForSubmit(true);
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <DjangoCSRFToken />
        <input type="hidden" name="is_created" value="True" />
        <AboutEventDisplay event={this.props.project} viewOnly={true} showHeaders={false}/>
      </React.Fragment>
    );
  }
}

export default EventPreviewForm;
