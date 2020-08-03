// @flow

import React from "react";
import Section from "../../../components/enums/Section.js";
import url from "../../utils/url.js";
import Moment from "react-moment";
import type {Dictionary} from "../../types/Generics.jsx";
import Sort from "../../utils/sort.js";
import Truncate from "../../utils/truncate.js";
import GlyphStyles from "../../utils/glyphs.js";
import utils from "../../utils/utils.js";
import EventAPIUtils, {EventTileAPIData} from "../../utils/EventAPIUtils.js";
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";

type Props = {|
  Event: EventTileAPIData,
  tagDictionary: Dictionary<TagDefinition>,
  maxTextLength: number,
  maxIssuesCount: number
|};
//fontawesome fixed width class
const glyphFixedWidth = " fa-fw";

class EventCard extends React.PureComponent<Props> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
        <div className="ProjectCard-root">
          <a href={url.section(Section.AboutEvent, {id: this.props.Event.Event_id})}
            rel="noopener noreferrer">
            {this._renderLogo()}
            {this._renderSubInfo()}
            {this._renderTitleAndIssue()}
            {this._renderEventDescription()}
            {this._renderIssueAreas()}
          </a>
        </div>
    );
  }
  _renderLogo(): React$Node {

    return (
      <div className="ProjectCard-logo">
        <img src={this.props.Event && this.props.Event.Event_thumbnail ? this.props.Event.Event_thumbnail.publicUrl : "/static/images/projectlogo-default.png"}/>
      </div>
    )
  }
  _renderTitleAndIssue(): React$Node {
    const Event: EventTileAPIData = this.props.Event;
    return (
      <div className="ProjectCard-title">
        <h2>{Event.Event_name}</h2>
        <h4>
          {Event.Event_project_count + " " + utils.pluralize("project","projects", Event.Event_project_count)}
        </h4>
      </div>
    )
  }
  _renderEventDescription(): React$Node {
    return (
        <div className="ProjectCard-description">
          <p>{Truncate.stringT(this.props.Event.Event_short_description, this.props.maxTextLength)}</p>
        </div>
    );
  }
  _renderIssueAreas(): React$Node {
    return (
    <div className="ProjectCard-skills">
      <h3>Issues</h3>
      {this._generateIssueList()}
    </div>
    )
  }
  _generateIssueList(): React$Node {
    // Get sorted truncated list of tag names
    let issueNames: $ReadOnlyArray<string> = Sort.byCountDictionary(this.props.Event.Event_issue_areas);
    issueNames = issueNames.map((issueName: string) => this.props.tagDictionary[issueName].display_name);
    issueNames = Truncate.arrayT(issueNames, this.props.maxIssuesCount);

    return (
      <ul>
        {issueNames.map((issueName: string, i: number) =>
          <li key={i}>{issueName}</li>
        )}
      </ul>
    );
  }
  _renderSubInfo(): React$Node {
    const Event: EventTileAPIData = this.props.Event;
    const location: string = Event.Event_country && EventAPIUtils.getLocationDisplayName(Event.Event_country);
    return (
      <div className="ProjectCard-subinfo">
        <ul>
        {location &&
          <li>
            <i className={GlyphStyles.MapMarker + glyphFixedWidth}></i>
            {location}
          </li>
        }
        {Event.Event_date_modified &&
          <li>
            <i className={GlyphStyles.Clock + glyphFixedWidth}></i>
            <Moment fromNow>{Event.Event_date_modified}</Moment>
          </li>
        }
        </ul>
      </div>
    )
  }
}

export default EventCard;
