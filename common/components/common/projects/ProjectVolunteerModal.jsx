// @flow

import React from 'react';
import metrics from "../../utils/metrics.js";
import {Modal, Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import ProjectAPIUtils from '../../utils/ProjectAPIUtils.js'
import CurrentUser from "../../utils/CurrentUser.js";
import ConfirmationModal from '../../common/confirmation/ConfirmationModal.jsx';
import TagCategory from "../tags/TagCategory.jsx";
import TagSelector from "../tags/TagSelector.jsx";
import {TagDefinition} from "../../utils/ProjectAPIUtils.js";
import {SelectOption} from "../../types/SelectOption.jsx";
import Select from 'react-select'
import moment from 'moment';


type Props = {|
  projectId: number,
  showModal: boolean,
  handleClose: () => void
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  message: string,
  daysToVolunteerForOption: ?SelectOption,
  roleTag: ?TagDefinition,
  showConfirmationModal: boolean
|};

const volunteerPeriodsInDays: $ReadOnlyArray<SelectOption> = [
  ["Less than 1 week",7],
  ["1 week - 1 month",30],
  ["1 month - 3 months",90],
  ["3 months - 6 months",180],
  ["6 months - 1 year",365]
].map((textDaysPair) => ({label:textDaysPair[0], value:textDaysPair[1]}));

/**
 * Modal for volunteering to join a project
 */

class ProjectVolunteerModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isSending: false,
      message: "",
      daysToVolunteerForOption: null,
      roleTag: null,
      showConfirmationModal: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.askForSendConfirmation = this.askForSendConfirmation.bind(this);
    this.receiveSendConfirmation = this.receiveSendConfirmation.bind(this);
  }
    
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }
  
  handleChange(event: SyntheticInputEvent<HTMLInputElement>): void {
      this.setState({message: event.target.value});
  }
  
  onRoleChange(role: $ReadOnlyArray<TagDefinition>): void {
    this.state.roleTag = role[0];
    this.forceUpdate();
  }

  askForSendConfirmation(): void {
    metrics.logVolunteerClickVolunteerSubmit(CurrentUser.userID(), this.props.projectId);
    this.setState({showConfirmationModal:true});
  }

  receiveSendConfirmation(confirmation: boolean): void {
    if (confirmation) {
      this.handleSubmit()
    }
    this.setState({showConfirmationModal: false});
  }
  
  handleVolunteerPeriodSelection(daysToVolunteerForOption: SelectOption): void {
    this.setState({daysToVolunteerForOption: daysToVolunteerForOption});
  }
  
  handleSubmit() {
    this.setState({isSending:true});
    metrics.logVolunteerClickVolunteerSubmitConfirm(CurrentUser.userID(), this.props.projectId);
    ProjectAPIUtils.post("/volunteer/" + this.props.projectId + "/",
      {
        message: this.state.message,
        projectedEndDate: moment().utc().add(this.state.daysToVolunteerForOption.value, 'days').format(),
        roleTag: this.state.roleTag.tag_name
      },
      response => this.closeModal(true),
      response => null /* TODO: Report error to user */
      );
  }

  closeModal(submitted: boolean){
    this.setState({isSending:false});
    this.props.handleClose(submitted);
  }

  render(): React$Node {
    return (
      <div>
        <ConfirmationModal
          showModal={this.state.showConfirmationModal}
          message="Do you want to apply to this project?"
          onSelection={this.receiveSendConfirmation}
        />
          <Modal show={this.state.showModal}
             onHide={this.closeModal.bind(this, false)}
          >
              <Modal.Header >
                  <Modal.Title>Volunteer Application</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FormGroup>
                  <div className="form-group">
                    <label htmlFor="project_technologies">Role You are Applying For</label>
                    <TagSelector
                      value={[this.state.roleTag]}
                      category={TagCategory.ROLE}
                      allowMultiSelect={false}
                      onSelection={this.onRoleChange.bind(this)}
                    />
                  </div>
                  <ControlLabel>How long do you expect to be able to contribute to this project?</ControlLabel>
                  {this._renderVolunteerPeriodDropdown()}
                  <ControlLabel>Message:</ControlLabel>
                  <div className="character-count">
                    { (this.state.message || "").length} / 3000
                  </div>
                  <FormControl componentClass="textarea"
                    placeholder="I'm interested in helping with this project because..."
                    rows="4"
                    cols="50"
                    name="message"
                    maxLength="3000"
                    value={this.state.message}
                    onChange={this.handleChange}/>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModal.bind(this, false)}>{"Cancel"}</Button>
                <Button
                  disabled={this.state.isSending || !this.state.roleTag || !this.state.daysToVolunteerForOption || !this.state.message}
                  onClick={this.askForSendConfirmation}>{this.state.isSending ? "Sending" : "Send"}
                </Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
  
  _renderVolunteerPeriodDropdown(): React$Node{
    return <Select
      options={volunteerPeriodsInDays}
      onChange={this.handleVolunteerPeriodSelection.bind(this)}
      className="form-control"
      simpleValue={true}
      isClearable={false}
      isMulti={false}
    />
  }
}

export default ProjectVolunteerModal;