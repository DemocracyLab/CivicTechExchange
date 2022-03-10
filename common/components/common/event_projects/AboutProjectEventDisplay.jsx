// @flow

import React from "react";
import _ from "lodash";
import AboutPositionEntry from "../positions/AboutPositionEntry.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import type { PositionInfo } from "../../forms/PositionInfo.jsx";
import Sort from "../../utils/sort.js";
import { LinkTypes } from "../../constants/LinkConstants.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import type { EventProjectAPIDetails } from "../../utils/EventProjectAPIUtils.js";
import ProjectOwnersSection from "../owners/ProjectOwnersSection.jsx";
import VolunteerSection from "../volunteers/VolunteerSection.jsx";
import type Moment from "moment";
import datetime, { DateFormat } from "../../utils/datetime.js";
import { Glyph, GlyphStyles, GlyphSizes } from "../../utils/glyphs.js";
import Button from "react-bootstrap/Button";

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
          <div className="AboutProjectEvent-top-section col-12">
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
      <div className="AboutProjectEvent-top-content">
        <div className="AboutProjectEvent-event-logo d-lg-none">
          {eventProject?.event_thumbnail.publicUrl ? (
            <img
              src={eventProject.event_thumbnail.publicUrl}
              alt="Event Logo"
            ></img>
          ) : null}
        </div>
        <div className="AboutProjectEvent-top-names">
          <div className="AboutProjectEvent-top-names-text">
            <h1>{eventProject && eventProject.project_name}</h1>
            <h3>{eventProject && eventProject.event_name}</h3>
          </div>
          <div className="AboutProjectEvent-event-logo-desktop d-none d-lg-block">
            {eventProject?.event_thumbnail.publicUrl ? (
              <img
                src={eventProject.event_thumbnail.publicUrl}
                alt="Event Logo"
              ></img>
            ) : null}
          </div>
        </div>
        <div className="AboutProjectEvent-project-logo p-3">
          {eventProject.project_thumbnail.publicUrl ? (
            <img
              src={eventProject.project_thumbnail.publicUrl}
              alt="Project Logo"
            />
          ) : null}
        </div>
        <div className="AboutProjectEvent-top-iconrow p-3">
          {this._renderIconList()}
        </div>
        <div className="AboutProjectEvent-top-button p-3">
          <Button variant="primary">PH: Sign up</Button>
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
        {eventProject && !_.isEmpty(eventProject.project_owners) && (
          <React.Fragment>
            <div className="AboutProject-staff AboutProject-secondary-section">
              {this._renderTeam()}
            </div>
          </React.Fragment>
        )}
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

  _renderTeam(): React$Node {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;
    const numVolunteers = eventProject["project_volunteers"].length || 0;
    const groupedVolunteers = _.groupBy(
      eventProject.project_volunteers,
      "roleTag.subcategory"
    );
    const sortedVolunteers = Object.entries(groupedVolunteers).sort();
    // may not need all these consts; test what happens when project_volunteers is null/empty

    // end result: group and count volunteers by subcategory, then render VolunteerSection for each subcategory
    // TODO: Do we need the additional props used on AboutProject for VolunteerSection?
    return (
      <React.Fragment>
        <h3>Team</h3>
        <ProjectOwnersSection owners={eventProject.project_owners} />
        <h3>Total RSVP: ({numVolunteers})</h3>
        {!_.isEmpty(sortedVolunteers) &&
          sortedVolunteers.map(([key, value]) => {
            return (
              <React.Fragment key={key}>
                <ul>
                  <li>
                    <h4>
                      {key} ({value.length})
                    </h4>
                  </li>
                </ul>
                <VolunteerSection
                  volunteers={value}
                  renderOnlyPending={false}
                />
              </React.Fragment>
            );
          })}
      </React.Fragment>
    );
  }

  _renderIconList(): React$Node {
    const eventProject: EventProjectAPIDetails = this.state.eventProject;

    const startDate: Moment = datetime.parse(eventProject.event_date_start);

    return (
      <React.Fragment>
        <div className="AboutProject-icon-row">
          <i className={Glyph(GlyphStyles.Calendar, GlyphSizes.LG)} />
          <p className="AboutProject-icon-text">
            {startDate.format(DateFormat.MONTH_DATE_YEAR)}
          </p>
        </div>
        <div className="AboutProject-icon-row">
          <i className={Glyph(GlyphStyles.Clock, GlyphSizes.LG)} />
          <p className="AboutProject-icon-text">
            {startDate.format(DateFormat.TIME_TIMEZONE)}
          </p>
        </div>
        <div className="AboutProject-icon-row">
          <i className={Glyph(GlyphStyles.MapMarker, GlyphSizes.LG)} />
          <p className="AboutProject-icon-text">
            {eventProject.event_location}
          </p>
        </div>
        <div className="AboutProject-icon-row">
          <i className={Glyph(GlyphStyles.Folder, GlyphSizes.LG)} />
          <p className="AboutProject-icon-text">
            <a
              href={url.section(Section.AboutProject, {
                id: eventProject.project_id,
              })}
            >
              Project Profile
            </a>{" "}
          </p>
        </div>
        <div className="AboutProject-icon-row">
          <i className={Glyph(GlyphStyles.CalendarSolid, GlyphSizes.LG)} />
          <p className="AboutProject-icon-text">
            <a
              href={url.section(Section.AboutEvent, {
                id: eventProject.event_id,
              })}
            >
              Hackathon Home Page
            </a>
          </p>
        </div>
      </React.Fragment>
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
