// @flow

import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import Select from "react-select";
import { CountryList } from "../../constants/Countries.js";
import metrics from "../../utils/metrics.js";

type CountryOption = {|
  value: string,
  label: string,
|};

type FormFields = {|
  email: ?string,
  country: ?CountryOption,
  postal_code: ?string,
  filters: ?string,
|};

type Props = {|
  searchFilters: string,
  showModal: boolean,
  handleClose: () => void,
|};
type State = {|
  showModal: boolean,
  countries: $ReadOnlyArray<CountryOption>,
  formFields: FormFields,
|};

/**
 * Modal for ingesting information for user alerts
 */

class AlertSignupModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const countries: $ReadOnlyArray<CountryOption> = Object.keys(
      Countries
    ).map(countryCode => ({
      value: countryCode,
      label: Countries[countryCode],
    }));
    this.state = {
      showModal: false,
      countries: countries,
    };
    this.state.formFields = this.resetFormFields(props);
    this.closeModal = this.closeModal.bind(this, this.props.handleClose);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return{
      showModal: nextProps.showModal,
      formFields: this.resetFormFields(nextProps),
    };
  }

  resetFormFields(props: Props): FormFields {
    return {
      email: "",
      country: this.state.countries.find(
        country => country.label === Countries.US
      ),
      postal_code: "",
      filters: props.searchFilters,
    };
  }

  onFormFieldChange(
    formFieldName: string,
    event: SyntheticInputEvent<HTMLInputElement>
  ): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
  }

  handleCountrySelection(selectedValue: string): void {
    let formFields: FormFields = this.state.formFields;
    formFields.country = selectedValue;
    this.setState({ formFields: formFields }, function() {
      this.forceUpdate();
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    ProjectAPIUtils.post(
      "/alert/create/",
      {
        email: this.state.formFields.email,
        filters: this.state.formFields.filters,
        postal_code: this.state.formFields.postal_code,
        country: this.state.formFields.country.value,
      },
      response => this.closeModal(),
      response => null /* TODO: Report error to user */
    );
    metrics.logUserAlertCreate(
      this.state.formFields.filters,
      this.state.formFields.postal_code,
      this.state.formFields.country.value
    );
  }

  isDisabled(): boolean {
    // Require email and a zip code (unless a country other than the US)
    // TODO: Require postal codes for the other countries that use them
    return (
      !this.state.formFields.email ||
      (this.state.formFields.country.label === Countries.US &&
        !this.state.formFields.postal_code)
    );
  }

  closeModal() {
    this.props.handleClose();
  }

  render(): React$Node {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <form onSubmit={this.handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Sign Up For Alerts</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Enter your email address and location to sign up for relevant
                alerts. As new projects are added that meet your search
                parameters, we will send them your way!
              </p>

              <div className="form-group">
                <label htmlFor="email_useralert">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email_useralert"
                  name="email_useralert"
                  maxLength="254"
                  value={this.state.formFields.email}
                  onChange={this.onFormFieldChange.bind(this, "email")}
                />
              </div>

              {/*TODO: Use CountrySelector component*/}
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <Select
                  id="country"
                  name="country"
                  options={this.state.countries}
                  value={this.state.formFields.country}
                  onChange={this.handleCountrySelection.bind(this)}
                  className="form-control"
                  simpleValue={false}
                  clearable={false}
                  multi={false}
                />
              </div>

              <div className="form-group">
                <label htmlFor="postal_code">Zip/Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  id="postal_code"
                  name="postal_code"
                  maxLength="10"
                  value={this.state.formFields.postal_code}
                  onChange={this.onFormFieldChange.bind(this, "postal_code")}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={this.closeModal}>
                {"Cancel"}
              </Button>
              <Button
                variant="primary"
                disabled={this.isDisabled()}
                type="submit"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

export default AlertSignupModal;
