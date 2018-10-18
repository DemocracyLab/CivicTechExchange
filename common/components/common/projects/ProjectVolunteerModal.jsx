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


type Props = {|
  projectId: number,
  showModal: boolean,
  handleClose: () => void
|};
type State = {|
  showModal: boolean,
  isSending: boolean,
  message: string,
  roleTag: TagDefinition,
  showConfirmationModal: boolean
|};

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
      showConfirmationModal: false
    };
    this.closeModal = this.closeModal.bind(this, this.props.handleClose);
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
    this.setState({showConfirmationModal:true});
  }

  receiveSendConfirmation(confirmation: boolean): void {
    if (confirmation) {
      this.handleSubmit()
    }
    this.setState({showConfirmationModal: false});
  }

  handleSubmit() {
    this.setState({isSending:true});
    metrics.logUserContactedProjectOwner(CurrentUser.userID(), this.props.projectId);
    ProjectAPIUtils.post("/volunteer/" + this.props.projectId + "/",
      {
        message: this.state.message,
        roleTag: this.state.roleTag.tag_name
      },
      response => this.closeModal(),
      response => null /* TODO: Report error to user */
      );
  }

  closeModal(){
    this.setState({isSending:false});
    this.props.handleClose();
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
                 onHide={this.closeModal}
                 style={{paddingTop:'20%'}}
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
                  <ControlLabel>Message:</ControlLabel>
                  <FormControl componentClass="textarea"
                    placeholder="I'm interested in helping with this project because..."
                    rows="4"
                    cols="50"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleChange}/>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModal}>{"Cancel"}</Button>
                <Button disabled={this.state.isSending || !this.state.roleTag} onClick={this.askForSendConfirmation}>{this.state.isSending ? "Sending" : "Send"}</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default ProjectVolunteerModal;