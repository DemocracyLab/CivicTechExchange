// @flow

import React from "react";
import CurrentUser from "../utils/CurrentUser.js";
import cdn, { Images } from "../utils/cdn.js";

class SignedUpController extends React.Component<{||}> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    // TODO: Give better indication that email has been sent when user clicks resend link
    return (
      <div className="SignedUpController-root container text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10">
            <div className="SignedUpController-logo">
              <img src={cdn.image(Images.DL_GLYPH)} />
            </div>
            <div className="SignedUpController-greeting">
              <h3>Check your email</h3>
              <p>
                We've sent a message to {CurrentUser.email()} <br /> with a link
                to verify your account.
              </p>
              <p>
                Didn't get an email?
                <br />
                <a href="/verify_user">Resend verification email</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignedUpController;
