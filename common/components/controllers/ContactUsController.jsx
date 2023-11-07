// @flow

import React from "react";
import ContactForm from "../forms/ContactForm.jsx";

class ContactUsController extends React.PureComponent<{||}> {

  render(): $React$Node {
    return (
      <React.Fragment>
        <div className="container contact-us-root">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xxl-9">
              <h1>Contact Us</h1>
              <p>
                To contact DemocracyLab, please fill out this form to send us a
                message and we'll get back to you. All fields are required.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ContactUsController;
