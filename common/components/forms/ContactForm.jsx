// @flow

import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Guard from "../utils/guard.js";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";

type Props = {|
  showCompany: boolean,
  onSubmit: () => void,
|};

type State = FormFields & ControlVariables;

type FormFields = {|
  fname: string,
  lname: string,
  emailaddr: string,
  message: string,
  company_name: string,
  reCaptchaValue: string,
|};

type ControlVariables = {|
  sendStatusMessage: string,
  sendStatusClass: string,
  isSending: boolean,
|};

class ContactForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      emailaddr: "",
      message: "",
      company_name: "",
      sendStatusMessage: null,
      sendStatusClass: null,
      isSending: false,
      reCaptchaValue: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = Guard.duplicateInput(this.handleSubmit.bind(this));
    this.reCaptchaOnChange = this.reCaptchaOnChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSending: true });
    //get reCaptcha hash and submitted message and send it to backend
    //backend will validate the captcha and send the message if validated or return a failure message if there's a problem
    ProjectAPIUtils.post(
      "/contact/democracylab",
      {
        fname: this.state.fname,
        lname: this.state.lname,
        emailaddr: this.state.emailaddr,
        company_name: this.state.company_name,
        message: this.state.message,
        reCaptchaValue: this.state.reCaptchaValue,
      },
      response => this.showSuccess(),
      response => this.showFailure()
    );
  }

  showSuccess() {
    //show success message and clear form. TODO: send user to a confirm page
    this.setState(
      {
        sendStatusMessage:
          "Message sent successfully! We will get back to you as soon as possible.",
        sendStatusClass: "ContactForm-status-success",
        fname: "",
        lname: "",
        emailaddr: "",
        message: "",
        company_name: "",
        isSending: false,
      },
      this.props.onSubmit
    );
  }
  showFailure() {
    //do not clear form when message fails, so the user does not have to retype
    this.setState(
      {
        sendStatusMessage:
          "We encountered an error sending your message. Please try again.",
        sendStatusClass: "ContactForm-status-error",
        isSending: false,
      },
      this.props.onSubmit
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    //if any input is made, clear the display of the send status message
    this.setState({
      [name]: value,
      sendStatusMessage: null,
      sendStatusClass: null,
    });
  }

  reCaptchaOnChange(value) {
    //when the reCaptcha is completed, set the value in state
    this.setState({
      reCaptchaValue: value,
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.sendStatusMessage ? (
          <div
            className={
              "ContactForm-status-message" + " " + this.state.sendStatusClass
            }
          >
            {this.state.sendStatusMessage}
          </div>
        ) : null}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            {this.props.showCompany && this._renderCompanyField()}
            <label htmlFor="fname">First name:</label>
            <input
              required
              className="form-control"
              name="fname"
              id="fname"
              type="text"
              placeholder="Your first name"
              value={this.state.fname}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lname">Last name:</label>
            <input
              required
              className="form-control"
              name="lname"
              id="lname"
              type="text"
              placeholder="Your last name"
              value={this.state.lname}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailaddr">Your email address:</label>
            <input
              required
              className="form-control"
              name="emailaddr"
              type="email"
              id="emailaddr"
              placeholder="name@example.com"
              value={this.state.emailaddr}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              required
              className="form-control"
              name="message"
              id="message"
              placeholder="Type your message here"
              rows="8"
              value={this.state.message}
              onChange={this.handleInputChange}
            />
          </div>
          <p>Before sending your message, please complete this captcha.</p>
          <ReCAPTCHA
            sitekey={window.GR_SITEKEY}
            onChange={this.reCaptchaOnChange}
          />
          <input
            type="submit"
            className="btn btn-primary ContactForm-submit-btn"
            value={this.state.isSending ? "Sending" : "Send message"}
            disabled={!this.state.reCaptchaValue || this.state.isSending}
          />
        </form>
      </React.Fragment>
    );
  }

  _renderCompanyField(): ?React$Node {
    return (
      <div className="form-group">
        <label htmlFor="company_name">Company (Optional):</label>
        <input
          className="form-control"
          name="company_name"
          id="company_name"
          type="text"
          placeholder="Your company name"
          value={this.state.company_name}
          onChange={this.handleInputChange}
        />
      </div>
    );
  }
}

export default ContactForm;
