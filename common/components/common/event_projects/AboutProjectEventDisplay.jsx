// @flow

import React from "react";
import _ from "lodash";
import AboutPositionEntry from "../positions/AboutPositionEntry.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import type { PositionInfo } from "../../forms/PositionInfo.jsx";
import Sort from "../../utils/sort.js";
import { LinkTypes } from "../../constants/LinkConstants.js";
import url from "../../utils/url.js";
import type { EventProjectAPIDetails } from "../../utils/EventProjectAPIUtils.js";

type Props = {|
  eventProject: ?EventProjectAPIDetails,
  viewOnly: boolean,
|};

type State = {|
  eventProject: ?EventProjectAPIDetails,
  viewOnly: boolean,
  showJoinModal: boolean,
  positionToJoin: ?PositionInfo,
  showPositionModal: boolean,
  shownPosition: ?PositionInfo,
|};

class AboutProjectEventDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super();
    this.state = {
      eventProject: props.eventProject,
      viewOnly: props.viewOnly,
      showContactModal: false,
      showPositionModal: false,
      shownPosition: null,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      eventProject: nextProps.eventProject,
      viewOnly: nextProps.viewOnly || url.argument("embedded"),
    });
  }

  handleShowVolunteerModal(position: ?PositionInfo) {
    this.setState({
      showJoinModal: true,
      positionToJoin: position,
    });
  }

  confirmJoinProject(confirmJoin: boolean) {
    if (confirmJoin) {
      window.location.reload(true);
    } else {
      this.setState({ showJoinModal: false });
    }
  }

  render(): React$Node {
    const eventProject = this.state.eventProject;
    return (
      <div className="container Profile-root">
        <div className="row">
          <div className="Profile-top-section col-12">
            {this._renderTopSection(eventProject)}
          </div>
        </div>
        <div className="row flex-lg-nowrap">
          <div className="Profile-primary-section col-12 col-lg-auto flex-lg-shrink-1">
            {this._renderPrimarySection(eventProject)}
          </div>

          <div className="Profile-secondary-section col-12 col-lg-auto">
            {this._renderSecondarySection(eventProject)}
          </div>
        </div>
      </div>
    );
  }

  _renderTopSection(eventProject: EventProjectAPIDetails): React$Node {
    return (
      <div className="Profile-top-section-content">
        <div className="Profile-top-logo">
          <img
            src={
              eventProject &&
              eventProject.project_thumbnail &&
              eventProject.project_thumbnail.publicUrl
            }
          />
        </div>
        <div className="Profile-top-details">
          <h1>{eventProject && eventProject.project_name}</h1>
        </div>
        <div className="AboutProjectEvent-top-iconrow">
          <ul>
            <li>event date</li>
            <li>event start time</li>
            <li>event location</li>
            <li>project profile link</li>
            <li>event link</li>
          </ul>
        </div>
      </div>
    );
  }

  // primary section content
  _renderPrimarySection(eventProject: EventProjectAPIDetails): React$Node {
    const comingSoonMsg: React$Node = (
      <React.Fragment>Coming soon!</React.Fragment>
    );

    return (
      <div className="Profile-primary-container">
        <div className="tab-content AboutProjectEvent-primary-container">
          <h3>About</h3>
          <p>{eventProject?.project_short_description}</p>

          <h3>Problem</h3>
          <p>{eventProject?.project_description}</p>

          <h3>Solution</h3>
          <p>{eventProject?.project_description_solution}</p>

          <h3>Hackathon Goal</h3>
          {eventProject?.event_project_goal ? (
            <p>{eventProject.event_project_goal}</p>
          ) : (
            comingSoonMsg
          )}

          <h3>Planned Scope</h3>
          {eventProject?.event_project_scope ? (
            <p>{eventProject.event_project_scope}</p>
          ) : (
            comingSoonMsg
          )}
          <h3>Additional Notes</h3>
          {eventProject?.event_project_onboarding_notes ? (
            <p>{eventProject.event_project_onboarding_notes}</p>
          ) : (
            comingSoonMsg
          )}
          {eventProject && !_.isEmpty(eventProject.project_technologies) && (
            <div className="AboutProject-technologies">
              <h3>Technologies Used</h3>
              {eventProject.project_technologies.map(tech => (
                <span className="Profile-pill" key={tech.tag_name}>
                  {tech.display_name}
                </span>
              ))}
            </div>
          )}

          {/*TODO: Schedule?*/}

          {eventProject && !_.isEmpty(eventProject.event_project_positions) && (
            <div className="AboutProject-positions-available pt-4">
              <h3>Roles Needed</h3>
              {this._renderPositions()}
            </div>
          )}
        </div>
      </div>
    );
  }

  _renderSecondarySection(eventProject: EventProjectAPIDetails) {
    return (
      <div className="Profile-secondary-container">
        {eventProject && !_.isEmpty(eventProject.event_project_links) && (
          <React.Fragment>
            <div className="Profile-links AboutProject-secondary-section">
              <h4>Links</h4>
              {this._renderLinks()}
            </div>
          </React.Fragment>
        )}

        {eventProject && !_.isEmpty(eventProject.event_project_files) && (
          <React.Fragment>
            <div className="AboutProject-files AboutProject-secondary-section">
              <h4>Files</h4>
              {this._renderFiles()}
            </div>
          </React.Fragment>
        )}

        <div className="AboutProject-staff AboutProject-secondary-section"></div>
      </div>
    );
  }

  _renderFiles(): ?Array<React$Node> {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    return (
      eventProject &&
      eventProject.event_project_files &&
      eventProject.event_project_files.map((file, i) => (
        <div key={i} className="AboutProject-file-link">
          <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">
            {file.fileName}
          </a>
        </div>
      ))
    );
  }

  _renderLinks(): ?Array<React$Node> {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    const linkOrder = [
      LinkTypes.CODE_REPOSITORY,
      LinkTypes.FILE_REPOSITORY,
      LinkTypes.MESSAGING,
      LinkTypes.PROJECT_MANAGEMENT,
    ];
    const sortedLinks =
      eventProject &&
      eventProject.event_project_links &&
      Sort.byNamedEntries(
        eventProject.event_project_links,
        linkOrder,
        link => link.linkName
      );
    return sortedLinks.map((link, i) => (
      <IconLinkDisplay key={i} link={link} />
    ));
  }

  _renderPositions(): ?Array<React$Node> {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    const canApply: boolean = false; // TODO: Implement
    return (
      eventProject &&
      eventProject.event_project_positions &&
      _.chain(eventProject.event_project_positions)
        .filter(position => !position.isHidden)
        .sortBy(["orderNumber", "id"])
        .value()
        .map((position, i) => {
          return (
            <AboutPositionEntry
              key={i}
              project={eventProject}
              position={position}
              onClickApply={
                canApply
                  ? this.handleShowVolunteerModal.bind(this, position)
                  : null
              }
            />
          );
        })
    );
  }
}

export default AboutProjectEventDisplay;
