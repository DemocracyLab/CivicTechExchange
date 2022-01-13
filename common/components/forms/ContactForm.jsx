// @flow

import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Guard from "../utils/guard.js";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";

type Props = {|
  showCompany: boolean,
  onSubmit: () => void,
  interest_sponsor: boolean,
  interest_hackathon: boolean,
|};

type State = FormFields & ControlVariables;

type FormFields = {|
  fname: string,
  lname: string,
  emailaddr: string,
  message: string,
  interest_sponsor: boolean,
  interest_hackathon: boolean,
  interest_other: boolean,
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
      interest_sponsor: this.props.interest_sponsor || false,
      interest_hackathon: this.props.interest_hackathon || false,
      interest_other: false,
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
        message: this.state.message,
        reCaptchaValue: this.state.reCaptchaValue,
        interest_sponsor: this.state.interest_sponsor,
        interest_hackathon: this.state.interest_hackathon,
        interest_other: this.state.interest_other,
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
          <div className="ContactForm-container">
            <div className="ContactForm-group">
              <div className="form-group">
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
            </div>
            <div className="ContactForm-group">
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <div className="character-count">
                  {(this.state.message || "").length} / 3000
                </div>
                <textarea
                  required
                  className="form-control"
                  name="message"
                  id="message"
                  placeholder="Type your message here"
                  rows="8"
                  maxLength="3000"
                  value={this.state.message}
                  onChange={this.handleInputChange}
                />
              </div>
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
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default ContactForm;
