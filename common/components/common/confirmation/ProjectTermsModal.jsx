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
class ProjectTermsModal extends React.PureComponent<Props, State> {
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
      <NotificationModal headerText="Terms of Service" buttonText="Close and Continue" showModal={this.state.showModal} onClickButton={this.confirm.bind(this)}>
        <div className="Terms-body">
          <ul>
            <li>I am submitting registration information that is truthful and accurate and will update this information if anything changes.</li>
            <li>I agree not to use DemocracyLab to violate any law or regulation, violate any third-party right, disrupt DemocracyLab services, or to transmit mass unsolicited advertisements via e-mail or other means.</li>
            <li>I release, forever discharge, hold harmless, and indemnify DemocracyLab from any and all liability, claims, and demands related to my use of DemocracyLab and use of third-party volunteers via DemocracyLab.</li>
            <li>I am offering volunteering projects that are civic, charitable, or humanitarian in nature.</li>
            <li>I accept third-party volunteers that are offering their assistance solely for their own personal civic, charitable, or humanitarian reasons.</li>
            <li>I have not promised and will not provide compensation or benefits to any third-party volunteer in exchange for their services.</li>
            <li>I am receiving volunteer services directly from each third-party volunteer and any associated liability is entirely with that volunteer, not with DemocracyLab.</li>
            <li>I acknowledge that third-party volunteers will perform the project tasks on a temporary, fully-independent basis without significant and ongoing control of work schedules and conditions by my organization.</li>
            <li>I will not accept via DemocracyLab volunteer services from an employee of my organization.</li>
            <li>I grant DemocracyLab permission to use all photographs, images, video, or audio recordings of my organization and logo in connection with my use of DemocracyLab and attendance at DemocracyLab events.</li>
            <li>I acknowledge that DemocracyLab may change these terms and may modify or discontinue the site or services at its sole discretion.</li>
            <li>I agree that DemocracyLab may terminate my membership or use of the site and services without prior notice and remove and discard my content from the site for any reason, including if DemocracyLab believes I have violated these terms.</li>
          </ul>
        </div>
      </NotificationModal>
    );
  }
}

export default ProjectTermsModal;
