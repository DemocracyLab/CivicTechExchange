// @flow

import React from 'react';
import metrics from "../../utils/metrics.js";
import {Modal, Button} from 'react-bootstrap';
import ProjectAPIUtils from '../../utils/ProjectAPIUtils.js'
import Select from 'react-select'
import {Countries} from "../../constants/Countries.js";

type CountryOption = {|
  value: string,
  label: string,
|};

type FormFields = {|
  email: ?string,
  country: ?CountryOption,
  postal_code: ?string,
  filters: ?string
|};

type Props = {|
  searchFilters: string,
  showModal: boolean,
  handleClose: () => void
|};
type State = {|
  showModal: boolean,
  countries: $ReadOnlyArray<CountryOption>,
  formFields: FormFields
|};

/**
 * Modal for ingesting information for user alerts
 */

class AlertSignupModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const countries: $ReadOnlyArray<CountryOption> = Object.keys(Countries).map(countryCode => ({"value": countryCode, "label": Countries[countryCode]}));
    this.state = {
      showModal: false,
      countries: countries,
      formFields: {
        email: "",
        country: countries.find(country => country.label === Countries.US),
        postal_code: "",
        filters: this.props.searchFilters
      }
    };
    this.closeModal = this.closeModal.bind(this, this.props.handleClose);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
    
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }
  
  onFormFieldChange(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
  }

  handleSubmit() {
    // TODO: Metrics
    ProjectAPIUtils.post("/alert/create/",
      {
        email: this.state.formFields.email,
        filters: this.state.formFields.filters,
        postal_code: this.state.formFields.postal_code,
        country: this.state.formFields.country.value
      },
      response => this.closeModal(),
      response => null /* TODO: Report error to user */
      );
  }

  closeModal(){
    this.props.handleClose();
  }

  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.closeModal}
                 style={{paddingTop:'20%'}}
          >
              <Modal.Header >
                  <Modal.Title>Sign Up For Alerts</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Enter your email address and location to sign up for relevant alerts.  As new projects are added that meet your search parameters, we will send them your way!</p>
  
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="text" className="form-control" id="email" name="email" maxLength="254"
                         value={this.state.formFields.email} onChange={this.onFormFieldChange.bind(this, "email")}/>
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <Select
                    id="country"
                    name="country"
                    options={this.state.countries}
                    value={this.state.formFields.country}
                    className="form-control"
                    simpleValue={false}
                    clearable={false}
                    multi={false}
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="postal_code">Zip/Postal Code</label>
                  <input type="text" className="form-control" id="postal_code" name="postal_code" maxLength="10"
                         value={this.state.formFields.postal_code} onChange={this.onFormFieldChange.bind(this, "postal_code")}/>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModal}>{"Cancel"}</Button>
                <Button disabled={!this.state.formFields.email || !this.state.formFields.postal_code} onClick={this.handleSubmit}>Submit</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default AlertSignupModal;