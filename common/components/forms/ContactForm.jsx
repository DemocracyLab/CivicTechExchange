// @flow

import React from 'react';

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
      <form>
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


      </form>
    );
  }
}

export default ContactForm
