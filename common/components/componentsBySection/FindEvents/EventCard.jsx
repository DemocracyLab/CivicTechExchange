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
import {EventTileAPIData} from "../../utils/EventAPIUtils.js";
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";

type Props = {|
  event: EventTileAPIData,
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
          <a href={url.section(Section.AboutEvent, {id: this.props.event.event_id})}
            rel="noopener noreferrer">
            {this._renderLogo()}
            {this._renderSubInfo()}
            {this._renderTitleAndIssue()}
            {this._renderEventDescription()}
          </a>
        </div>
    );
  }
  _renderLogo(): React$Node {

    return (
      <div className="ProjectCard-logo">
        <img src={this.props.event && this.props.event.event_thumbnail ? this.props.event.event_thumbnail.publicUrl : "/static/images/projectlogo-default.png"}/>
      </div>
    )
  }
  _renderTitleAndIssue(): React$Node {
    const Event: EventTileAPIData = this.props.event;
    return (
      <div className="ProjectCard-title">
        <h2>{Event.event_name}</h2>
        <h4>
          "DemocracyLab"
        </h4>
      </div>
    )
  }
  _renderEventDescription(): React$Node {
    return (
        <div className="ProjectCard-description">
          <p>{Truncate.stringT(this.props.event.event_short_description, this.props.maxTextLength)}</p>
        </div>
    );
  }
  _renderSubInfo(): React$Node {
    const Event: EventTileAPIData = this.props.event;
    const location: string = Event.event_location;
    return (
      <div className="ProjectCard-subinfo">
        <ul>
        {location &&
          <li>
            <i className={GlyphStyles.MapMarker + glyphFixedWidth}></i>
            {location}
          </li>
        }
        {Event.event_date_start &&
          <li>
            <i className={GlyphStyles.Clock + glyphFixedWidth}></i>
            <Moment fromNow>{Event.event_date_start}</Moment>
          </li>
        }
        </ul>
      </div>
    )
  }
}

export default EventCard;
