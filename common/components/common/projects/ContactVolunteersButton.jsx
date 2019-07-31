// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import Section from '../../enums/Section.js';
import url from '../../utils/url.js';
import ContactProjectModal from "./ContactProjectModal.jsx";
import metrics from "../../utils/metrics";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils";

type Props = {|
    project: ?ProjectDetailsAPIData
|};
type State = {|
    project: ?ProjectDetailsAPIData,
    showContactModal: boolean,
    buttonDisabled: boolean,
    buttonTitle: string
|};

/**
 * Button to open Modal for sending messages to project owners
 */
class ContactVolunteersButton extends React.PureComponent<Props, State> {
    constructor(props: Props): void {
        super(props);
        if(props.project) {
            this.state = this.getButtonDisplaySetup(props);
        } else {
            this.state = {
                project: null,
                showContactModal: false,
                buttonDisabled: false,
                buttonTitle: "Contact Volunteers"
            };
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.subjectLine = "Contact Volunteer";
        this._handleSubmission = this._handleSubmission.bind(this);
    }

    getButtonDisplaySetup(props: Props): State {
        const project = props.project;
        const newState = {
            project: project,
            showContactModal: false,
            buttonDisabled: false,
            buttonTitle: "Contact Volunteers"
        };
        if(!CurrentUser.isLoggedIn()) {
            newState.buttonDisabled = false;
            newState.buttonTitle = "Please sign up or log in to contact project owner";
        } else if(!CurrentUser.isEmailVerified()) {
            newState.buttonDisabled = true;
            // TODO: Provide mechanism to re-send verification email
            newState.buttonTitle = "Please verify your email address before contacting project owner";
        } else if(!project.project_claimed) {
            newState.buttonDisabled = true;
            newState.buttonTitle = "This project has not yet been claimed by its owner";
        }

        return newState;
    }

    componentWillReceiveProps(nextProps: Props): void {
        this.setState(this.getButtonDisplaySetup(nextProps));
    }

    handleShow() {
        metrics.logUserClickContactProjectOwner(CurrentUser.userID(), this.props.project.project_id);
        this.setState({ showContactModal: true });
    }

    handleClose() {
        this.setState({ showContactModal: false });
    }

    _renderContactVolunteerButton(): React$Node {
        return (
            <Button
                className="AboutProject-button btn btn-theme"
                type="button"
                disabled={this.state.buttonDisabled}
                title={"Contact Volunteers"}
                onClick={this.handleShow}
            >
                Contact Volunteers
            </Button>
        );
    }

    _renderLinkToSignInButton(): React$Node {
        return (
            <Button
                className="AboutProject-button btn btn-theme clear-button-appearance"
                type="button"
                disabled={this.state.buttonDisabled}
                title={this.state.buttonTitle}
                href={`/index/?section=LogIn&prev=${window.location.href.split('?section=')[1]}`}
            >
                Sign in to Contact Project
            </Button>
        );
    }

    displayContactVolunteerButton(): ?React$Node {
        return (
            <React.Fragment>
                {this._renderContactVolunteerButton()}
                <ContactProjectModal
                    projectId={this.state.project && this.state.project.project_id}
                    showModal={this.state.showContactModal}
                    handleClose={this.handleClose}
                    handleSubmission={this._handleSubmission}
                    subjectLine={this.subjectLine}
                />
            </React.Fragment>
        );
    }

    _handleSubmission(body, subject, closeModal): ?React$Node {
        ProjectAPIUtils.post("/contact/volunteers/" + this.props.project.project_id + "/",
            {message: body, subject: subject}, //TODO: Create sendURL
            response => closeModal, //Send function to close modal
            response => null /* TODO: Report error to user */
        );
    }

    render(): ?React$Node {
        if(this.state) {
            if(CurrentUser.isCoOwnerOrOwner(this.props.project)) {
                return (
                    <div>
                        {this.displayContactVolunteerButton()}
                    </div>)
            }
        } else {
            return null;
        }
    }
}

export default ContactVolunteersButton;
