// @flow

import React from "react";
import Headers from "../common/Headers.jsx";
import ContactForm from "../forms/ContactForm.jsx";
import prerender from "../utils/prerender.js";

class ContactUsController extends React.PureComponent<{||}> {
  componentDidMount() {
    prerender.ready();
  }

  _renderHeader(): React$Node {
    const title: string = "DemocracyLab | Contact Us";
    const description: string = "Contact information for DemocracyLab.";

    return <Headers title={title} description={description} />;
  }

  render(): $React$Node {
    return (
      <React.Fragment>
        {this._renderHeader()}
        <div className="container contact-us-root">
          <h1>Contact Us</h1>
          <p>
            To contact DemocracyLab, please fill out this form to send us a
            message and we'll get back to you. All fields are required.
          </p>
          <ContactForm />
        </div>
      </React.Fragment>
    );
  }
}

export default ContactUsController;
