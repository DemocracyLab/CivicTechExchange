// @flow

import React from 'react';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.jsx';

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
    ProjectAPIUtils.post("/contact/democracylab/",
        {
          fname: this.state.fname,
          lname: this.state.lname,
          emailaddr: this.state.emailaddr,
          message: this.state.message
        },
        response => this.showSuccess()
        response => this.showFailure()
        );
    }
  }

  showSuccess() {
    console.log('Successful send.')
  }
  showFailure() {
    console.log('Failed to send, please try again.')
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
        <label>
          First name:
          <input
            name="fname"
            type="text"
            value={this.state.fname}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Last name:
          <input
            name="lname"
            type="text"
            value={this.state.lname}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Your email address:
          <input
            name="emailaddr"
            type="email"
            value={this.state.emailaddr}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Message:
          <input
            name="message"
            type="textarea"
            value={this.state.message}
            onChange={this.handleInputChange} />
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default ContactForm
