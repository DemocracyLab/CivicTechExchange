// @flow

import React from 'react';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      emailaddr: '',
      message: '',
      sendStatusMessage: null,
      sendStatusClass: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    //validate our form here; only continue to post if it succsesfully validates

    ProjectAPIUtils.post("/contact/democracylab",
        {
          fname: this.state.fname,
          lname: this.state.lname,
          emailaddr: this.state.emailaddr,
          message: this.state.message
        },
        response => this.showSuccess(),
        response => this.showFailure()
        );
    }


  showSuccess() {
    this.setState({
      sendStatusMessage: 'Message sent successfully! We will get back to you as soon as possible.',
      sendStatusClass: 'ContactForm-status-success'
    })
  }
  showFailure() {
    this.setState({
      sendStatusMessage: 'We encountered an error sending your message. Please refresh and try again.',
      sendStatusClass: 'ContactForm-status-error'
    })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    //if any input is made, clear the display of the send status message
    this.setState({
      [name]: value,
      sendStatusMessage: null,
      sendStatusClass: null
    });
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.sendStatusMessage ? <div className={"ContactForm-status-message" + " " + this.state.sendStatusClass}>{this.state.sendStatusMessage}</div> : null}
        <div className="form-group">
          <label htmlFor="fname">
            First name:
          </label>
          <input
            className="form-control"
            name="fname"
            id="fname"
            type="text"
            placeholder="Your first name"
            value={this.state.fname}
            onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="lname">
            Last name:
          </label>
          <input
            className="form-control"
            name="lname"
            id="lname"
            type="text"
            placeholder="Your last name"
            value={this.state.lname}
            onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="emailaddr">
            Your email address:
          </label>
          <input
            className="form-control"
            name="emailaddr"
            type="email"
            id="emailaddr"
            placeholder="name@example.com"
            value={this.state.emailaddr}
            onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="message">
            Message:
          </label>
            <textarea
              className="form-control"
              name="message"
              id="message"
              placeholder="Type your message here"
              rows="8"
              value={this.state.message}
              onChange={this.handleInputChange} />
        </div>

        <input type="submit" value="Submit" className="btn btn-theme" />
      </form>
    );
  }
}

export default ContactForm
