// @flow

import React from 'react';
import NotificationModal from "../notification/NotificationModal.jsx";

type Props = {|
  showModal: boolean,
  onSelection: () => void
|};
type State = {|
  showModal: boolean,
|};

/**
 * Modal for getting yes/no confirmation
 */
class TermsModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }

  confirm(): void {
    this.props.onSelection();
    this.setState({
      showModal: false
    });
  }

  render(): React$Node {
    return (
      <NotificationModal headerText="Terms of Volunteering" buttonText="Close and Continue" showModal={this.state.showModal} onClickButton={this.confirm.bind(this)}>
        <div className="Terms-body">
          <ul>
            <li>I am volunteering solely for my personal purposes or pleasure, including for civic, charitable, or humanitarian reasons.</li>
            <li>I am freely donating my volunteer services and have no expectation of receiving and have not been promised compensation or benefits in exchange for any assistance I provide to project owners.</li>
            <li>I am donating my volunteer services to the owner of a tech-for-good project, not to DemocracyLab itself, and any associated liability is entirely with that project owner.</li>
            <li>I release and forever discharge and hold harmless DemocracyLab from any and all liability, claims, and demands related to my volunteering for third-party project owners, use of the DemocracyLab website, and attendance at DemocracyLab events. </li>
            <li>I understand that if I am responsible for injuries or property damage to project owners or others while acting outside the scope of volunteer assignments, that I may be held personally liable by the injured party.</li>
            <li>I will perform the project tasks on a temporary, fully-independent basis without significant and ongoing control of work schedules and conditions by the project owner.</li>
            <li>I am not volunteering for an organization with which I am employed nor am I expecting to receive a job offer from a project owner.</li>
            <li>I will not perform the type of work an employee would typically perform for a project owner’s customers or clients nor will I supervise employees of a project owner. I will use my own tools and equipment and will not seek reimbursement for any purchases of materials or supplies.</li>
            <li>I grant DemocracyLab permission to use all photographs, images, video, or audio recordings of me in connection with my attendance at DemocracyLab events or volunteering for project owners.</li>
            <li>I am at least 18 years old and possess the authority to bind myself to this agreement.</li>
          </ul>
        </div>
      </NotificationModal>
    );
  }
}

export default TermsModal;
