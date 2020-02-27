// @flow

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import type { LinkInfo } from './LinkInfo.jsx';
import Visibility from '../common/Visibility.jsx';
import FormValidation, {Validator} from "../forms/FormValidation.jsx";
import formHelper from "../utils/forms.js"
import url from '../utils/url.js';


type FormFields = {|
  project_link: ?string,
|};

type Props = {|
  showModal: boolean,
  existingLink: LinkInfo,
  onSaveLink: (LinkInfo) => void,
  onCancelLink: (void) => void
|};
type State = {|
  showModal: boolean,
  linkInfo: LinkInfo,
|};

/**
 * Modal for adding/editing hyperlinks
 */
class LinkEntryModal extends React.PureComponent<Props,State> {
  close: Function;
  save: Function;
  handleChange: Function;

  constructor(props: Props): void {
    super(props);
    const formFields: FormFields = {
      project_link: "",
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) => url.isValidUrl(
          formFields["project_link"]),
        errorMessage: "Please enter valid URL for project link."
      }
    ];
    const formIsValid: boolean = FormValidation.isValid(
      formFields, validations);
    this.state = {
      showModal: false,
      linkInfo: {
        linkUrl: "",
        linkName: "",
        visibility: Visibility.PUBLIC
      },
      formIsValid: formIsValid,
      formFields: formFields,
      validations: validations
    }
    this.close = this.close.bind(this);
    this.save = this.save.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.form = formHelper.setup();
  }

  resetModal(url:?string, name:?string, visibility:?string): void {
    this.setState({
      linkInfo: {
        linkUrl: url || "",
        linkName: name || "",
        visibility: visibility || Visibility.PUBLIC
      }
    });
    this.form.doValidation.bind(this)();
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
    if(nextProps.existingLink) {
      this.resetModal(
        nextProps.existingLink.linkUrl,nextProps.existingLink.linkName);
    } else {
      this.resetModal();
    }
  }

  componentDidMount() {
    this.form.doValidation.bind(this)();
  }

  onValidationCheck(formIsValid: boolean): void {
    if(formIsValid !== this.state.formIsValid) {
      this.setState({formIsValid});
    }
  }

  close(): void {
    this.setState({showModal: false});
    this.props.onCancelLink();
  }

  save(): void {
    //TODO: Validate that link is not duplicate of existing link in the list before saving
    //Sanitize link
    this.state.formFields.project_link = url.appendHttpIfMissingProtocol(
      this.state.formFields.project_link);
    this.state.linkInfo.linkUrl = this.state.formFields.project_link;
    this.props.onSaveLink(this.state.linkInfo);
    this.close();
  }

  handleChange(
    event: SyntheticInputEvent<HTMLInputElement>, propertyName: string): void {
    this.state.linkInfo[propertyName] = event.target.value;
    this.forceUpdate();
  }

  render(): React$Node {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.close}>
              <Modal.Header closeButton>
                  <Modal.Title>Add Link</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <label htmlFor="link-url">Link URL</label>
                  <input type="text"
                         className="form-control"
                         id="link-url" maxLength="2075"
                         value={this.state.formFields.project_link}
                         onChange={
                           this.form.onInput.bind(this, "project_link")
                         }/>
                  <label htmlFor="link-name">Link Name</label>
                  <input type="text" className="form-control" id="link-name" maxLength="200" value={this.state.linkInfo.linkName} onChange={(e) => this.handleChange(e, "linkName")}/>
              </Modal.Body>
              <FormValidation
                validations={this.state.validations}
                onValidationCheck={this.onValidationCheck.bind(this)}
                formState={this.state.formFields}
              />
              <Modal.Footer>
                  <Button variant="outline-secondary" onClick={this.close}>Close</Button>
                  <Button variant="primary"
                          disabled={!this.state.formIsValid}
                          onClick={this.save}>
                    Save
                  </Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default LinkEntryModal;
