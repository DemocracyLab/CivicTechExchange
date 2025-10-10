// @flow
import React from "react";

export default function VARFormIntro({ userFirstName }): React.Node {

    return (
        <div>
        <h2 className="var-form-intro"> {userFirstName ? `Hi, ${userFirstName}!` : 'Hi!'}</h2>
        <p className="var-form-intro">
            Thank you for volunteering. We appreciate you taking a few moments to let us know about your recent activity.
        </p>
        </div>
    );
};