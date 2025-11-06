// @flow

import React from "react";

type Props = {|
  showError: boolean,
|};

/**
 * VARErrorNotification - Display error messages to users when form validation fails
 * Shows an exclamation circle icon and error message
 * Background: Light red (#FDF0F0)
 * Border: Red rgba(227, 12, 12, 0.2)
 * Icon: Red circle with exclamation (#E30C0C)
 */
function VARErrorNotification(props: Props): React$Node {
  if (!props.showError) {
    return null;
  }

  return (
    <div className="var-error-notification">
      <div className="var-error-notification__inner">
        <div className="var-error-notification__icon">
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div className="var-error-notification__content">
          <div className="var-error-notification__message">
            Failed to submit report. Please make changes indicated below.
          </div>
        </div>
      </div>
    </div>
  );
}

export default VARErrorNotification;
