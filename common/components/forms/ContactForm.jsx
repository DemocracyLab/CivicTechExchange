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
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    ProjectAPIUtils.post("/contact/democracylab",
        {
          fname: this.state.fname,
          lname: this.state.lname,
          emailaddr: this.state.emailaddr,
          message: this.state.message
        },
        response => this.showResponse(response),
        response => null
        );
    }


  showResponse(response) {
    console.log('Send status: ' + response)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
