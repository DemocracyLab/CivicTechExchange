// @flow
//
// The important parts are
// 1)  Call form.setup((that) => that.state, this.onFormUpdate)
// 2) Implement onFormUpdate
// 3)  For the input onChange events, use form's methods, which will hook those changes up to onFormUpdate


import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import Guard from '../utils/guard.js';
import apiHelper from '../utils/api.js';
import form from '../utils/forms.js';

type State = FormFields & ControlVariables

type FormFields = {|
  fname: string,
  lname: string,
  emailaddr: string,
  message: string,
  reCaptchaValue: string,
|};

type ControlVariables = {|
  sendStatusMessage: string,
  sendStatusClass: string
|};

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      fname: '',
      lname: '',
      emailaddr: '',
      message: '',
      sendStatusMessage: null,
      sendStatusClass: null,
      reCaptchaValue: null,
    };

    this.handleSubmit = Guard.duplicateInput(this.handleSubmit.bind(this));
    this.reCaptchaOnChange = this.reCaptchaOnChange.bind(this);
    this.form = form.setup((that) => that.state, this.onFormUpdate)
  }


  handleSubmit(event) {
    event.preventDefault();
    //get reCaptcha hash and submitted message and send it to backend
    //backend will validate the captcha and send the message if validated or return a failure message if there's a problem
    apiHelper.postForm(
      "/contact/democracylab",
      this.formRef,
      response => this.showSuccess(),
      response => this.showFailure()
    );
  }

//clear the form on a successful send. #TODO: send them to a confirm page instead
  showSuccess() {
    this.setState({
      sendStatusMessage: 'Message sent successfully! We will get back to you as soon as possible.',
      sendStatusClass: 'ContactForm-status-success',
      fname: null,
      lname: null,
      emailaddr: null,
      message: null,
      reCaptchaValue: null
    })
  }
//leave the fields intact on error so they don't lose their message
  showFailure() {
    this.setState({
      sendStatusMessage: 'We encountered an error sending your message. Please try again.',
      sendStatusClass: 'ContactForm-status-error'
    })
  }

  reCaptchaOnChange(value) {
    //when the reCaptcha is completed, set the value in state
    this.setState({
      reCaptchaValue: value,
    })
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} ref={this.formRef}>
          <div className="form-group">
            <label htmlFor="fname">
              First name:
            </label>
            <input
              required
              className="form-control"
              name="fname"
              id="fname"
              type="text"
              placeholder="Your first name"
              value={this.state.fname}
              onChange={this.form.onInput.bind(this, "fname")} />
          </div>
          <div className="form-group">
            <label htmlFor="lname">
              Last name:
            </label>
            <input
              required
              className="form-control"
              name="lname"
              id="lname"
              type="text"
              placeholder="Your last name"
              value={this.state.lname}
              onChange={this.form.onInput.bind(this, "lname")} />
          </div>
          <div className="form-group">
            <label htmlFor="emailaddr">
              Your email address:
            </label>
            <input
              required
              className="form-control"
              name="emailaddr"
              type="email"
              id="emailaddr"
              placeholder="name@example.com"
              value={this.state.emailaddr}
              onChange={this.form.onInput.bind(this, "emailaddr")} />
          </div>
          <div className="form-group">
            <label htmlFor="message">
              Message:
            </label>
              <textarea
                required
                className="form-control"
                name="message"
                id="message"
                placeholder="Type your message here"
                rows="8"
                value={this.state.message}
                onChange={this.form.onInput.bind(this, "message")} />
          </div>
          <p>Before sending your message, please complete this captcha once you've filled out the form above.</p>
          <ReCAPTCHA
            sitekey={window.GR_SITEKEY}
            onChange={this.reCaptchaOnChange}
          />
          {this.state.reCaptchaValue && <input type="submit" value="Send message" className="btn btn-theme ContactForm-submit-btn" />}
          {this.state.sendStatusMessage ? <div className={"ContactForm-status-message" + " " + this.state.sendStatusClass}>{this.state.sendStatusMessage}</div> : null}
        </form>
    </React.Fragment>
    );
  }
}

export default ContactForm
