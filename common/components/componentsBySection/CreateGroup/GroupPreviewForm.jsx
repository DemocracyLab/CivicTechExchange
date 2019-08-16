// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import type {GroupDetailsAPIData} from "../../../components/utils/GroupAPIUtils.js";
import AboutGroupDisplay from "../../common/groups/AboutGroupDisplay.jsx";
import {OnReadySubmitFunc} from "./GroupFormCommon.jsx";

type Props = {|
  project: ?GroupDetailsAPIData, // TODO: Fix the key this is passed down as
  readyForSubmit: OnReadySubmitFunc
|};

/**
 * Shows preview for Group before finalizing
 */
class GroupPreviewForm extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
    // All fields optional
    props.readyForSubmit(true);
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <DjangoCSRFToken/>
        <input type="hidden" name="is_created" value="True"/>
        <AboutGroupDisplay
          group={this.props.project}
          viewOnly={true}
        />
      </React.Fragment>
    );
  }
}

export default GroupPreviewForm;
