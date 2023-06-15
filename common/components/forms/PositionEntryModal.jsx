// @flow

import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { TagDefinition } from "../utils/ProjectAPIUtils.js";
import TagSelector from "../common/tags/TagSelector.jsx";
import TagCategory from "../common/tags/TagCategory.jsx";
import { PositionInfo } from "./PositionInfo.jsx";
import FormValidation, { Validator } from "../forms/FormValidation.jsx";
import formHelper from "../utils/forms.js";
import urlHelper from "../utils/url.js";
import _ from "lodash";

type FormFields = {|
  role_tag: Array<TagDefinition>,
  description: string,
  description_link: string,
|};

type Props = {|
  showModal: boolean,
  existingPosition: PositionInfo,
  onSavePosition: PositionInfo => void,
  onCancel: void => void,
|};

type State = {|
  showModal: boolean,
  positionInfo: PositionInfo,
  formFields: FormFields,
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|};

/**
 * Modal for adding/editing project positions
 */
class PositionEntryModal extends React.PureComponent<Props, State> {
  close: Function;
  save: Function;

  constructor(props: Props): void {
    super(props);
    const formFields: FormFields = {
      role_tag: [],
      description: "",
      description_link: "",
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["role_tag"]),
        errorMessage: "Please select a role.",
      },
      {
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["description"]),
        errorMessage: "Please enter a brief description for the role.",
      },
      {
        checkFunc: (formFields: FormFields) =>
          urlHelper.isEmptyStringOrValidUrl(formFields["description_link"]),
        errorMessage: "Please enter valid URL for description link.",
      },
    ];
    const formIsValid: boolean = FormValidation.isValid(
      formFields,
      validations
    );
    this.state = {
      showModal: false,
      positionInfo: {
        roleTag: null,
        description: "",
        descriptionUrl: "",
        isHidden: false,
      },
      formFields: formFields,
      formIsValid: formIsValid,
      validations: validations,
    };
    this.close = this.close.bind(this);
    this.save = this.save.bind(this);
    this.form = formHelper.setup();
  }

  resetModal(existingPosition: ?PositionInfo): void {
    this.setState({
      positionInfo: {
        roleTag: existingPosition ? existingPosition.roleTag : null,
        description: existingPosition ? existingPosition.description : "",
        descriptionUrl: existingPosition ? existingPosition.descriptionUrl : "",
      },
      formFields: {
        role_tag: existingPosition ? [existingPosition.roleTag] : [],
        description: existingPosition ? existingPosition.description : "",
        description_link: existingPosition
          ? existingPosition.descriptionUrl
          : "",
      },
      formIsValid: existingPosition
        ? urlHelper.isEmptyStringOrValidUrl(existingPosition.descriptionUrl)
        : false,
    });
  }

  static getDerivedStateFromProps(nextProps: Props){
    let state: State = { showModal: nextProps.showModal, function() {
      this.resetModal(nextProps.existingPosition);
    }};
    return state;
  }

  componentDidMount() {
    this.form.doValidation.bind(this)();
  }

  onValidationCheck(formIsValid: boolean): void {
    if (formIsValid !== this.state.formIsValid) {
      this.setState({ formIsValid });
    }
  }

  close(): void {
    this.setState({ showModal: false });
    this.props.onCancel();
  }

  save(): void {
    let urlInput = this.state.formFields.description_link;
    if (urlHelper.isValidUrl(urlInput)) {
      urlInput = urlHelper.appendHttpIfMissingProtocol(urlInput);
    }
    this.setState(
      {
        positionInfo: {
          roleTag: this.state.formFields.role_tag[0],
          description: this.state.formFields.description,
          descriptionUrl: urlInput,
          isHidden: false,
        },
      },
      () => {
        this.props.onSavePosition(this.state.positionInfo);
        this.close();
      }
    );
  }

  render(): React$Node {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Role Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="project_technologies">Role</label>
              <TagSelector
                value={this.state.formFields.role_tag}
                category={TagCategory.ROLE}
                allowMultiSelect={false}
                onSelection={this.form.onSelection.bind(this, "role_tag")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position-description">
                Position Description
                {window.POSITION_DESCRIPTION_EXAMPLE_URL ? (
                  <span className="modal-hint">
                    <a
                      href={window.POSITION_DESCRIPTION_EXAMPLE_URL}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      (Example template)
                    </a>
                  </span>
                ) : null}
              </label>
              <div className="character-count">
                {(this.state.formFields.description || "").length} / 3000
              </div>
              <textarea
                className="form-control"
                id="position-description"
                name="position-description"
                placeholder="Describe the position's qualifications
                      and responsibilities"
                rows="4"
                maxLength="3000"
                value={this.state.formFields.description}
                onChange={this.form.onInput.bind(this, "description")}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="link-position-description-url">
                Link to Description (Optional)
              </label>
              <input
                type="text"
                className="form-control"
                id="link-position-description-url"
                maxLength="2075"
                value={this.state.formFields.description_link}
                onChange={this.form.onInput.bind(this, "description_link")}
                placeholder="http://"
              />
            </div>
          </Modal.Body>
          <FormValidation
            validations={this.state.validations}
            onValidationCheck={this.onValidationCheck.bind(this)}
            formState={this.state.formFields}
          />
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.close}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={!this.state.formIsValid}
              onClick={this.save}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default PositionEntryModal;
