// @flow

import React from "react";
import Section from "../../../components/enums/Section.js";
import url from "../../utils/url.js";
import Moment from "react-moment";
import type {Dictionary} from "../../types/Generics.jsx";
import Sort from "../../utils/sort.js";
import Truncate from "../../utils/truncate.js";
import {Glyph, GlyphWidth, GlyphStyles} from "../../utils/glyphs.js";
import utils from "../../utils/utils.js";
import {EventTileAPIData} from "../../utils/EventAPIUtils.js";
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";

type Props = {|
  event: EventTileAPIData,
  tagDictionary: Dictionary<TagDefinition>,
  maxTextLength: number,
  maxIssuesCount: number
|};

class EventCard extends React.PureComponent<Props> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
        <div className="EventCard-root">
          <a href={url.section(Section.AboutEvent, {id: this.props.event.event_id})}
            rel="noopener noreferrer">
            {this._renderEventLogo()}
            {this._renderEventInformation()}
            {this._renderEventTime()}
          </a>
        </div>
    );
  }

  _renderEventLogo(): React$Node {
    return (
      <div className="EventCard-logo">
        <img src={this.props.event && this.props.event.event_thumbnail ? this.props.event.event_thumbnail.publicUrl : "/static/images/projectlogo-default.png"}/>
      </div>
    );
  }

  //TODO: add organizer field to create event form/db record so we can use that instead
  _renderEventInformation(): React$Node {
    const Event: EventTileAPIData = this.props.event;
    const location: string = Event.event_location;
    return (
      <div className="EventCard-info">
        <h2>{Event.event_name}</h2>
        <h4>
          {Event.event_organizers_text}
        </h4>
        {location &&
          <ul>
            <li>
              <i className={Glyph(GlyphStyles.MapMarker, GlyphWidth.Fixed)}></i>
              {location}
            </li>
          </ul>
        }
      </div>
    );
  }

  _renderEventTime(): React$Node {
    const Event: EventTileAPIData = this.props.event;
    return (
      <div className="EventCard-time">
        {Event.event_date_start &&
          <h2><Moment format="LT">{Event.event_date_start}</Moment></h2>
        }
      </div>
    );
  }

}

export default EventCard;
