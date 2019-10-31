// @flow

import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import Avatar from "../avatar.jsx"
import {Glyph, GlyphStyles, GlyphSizes, GlyphWidth} from "../../utils/glyphs.js";
import CurrentUser from "../../utils/CurrentUser.js";


type Props = {|
  +volunteer: VolunteerDetailsAPIData,
  +isProjectAdmin: boolean,
  +isProjectCoOwner: boolean,
  +onOpenApplication: (VolunteerDetailsAPIData) => void,
  +onApproveButton: (VolunteerDetailsAPIData) => void,
  +onRejectButton: (VolunteerDetailsAPIData) => void,
  +onDismissButton: (VolunteerDetailsAPIData) => void,
  +onPromotionButton: (VolunteerDetailsAPIData) => void,
  +onDemotionButton: (VolunteerDetailsAPIData) => void,
  +onContactButton: (VolunteerDetailsAPIData) => void
|};

class VolunteerCard extends React.PureComponent<Props> {

  render(): React$Node {
    const volunteer: ?UserAPIData = this.props.volunteer.user;
    const roleTag: ?TagDefinition = this.props.volunteer.roleTag;
    const volunteerUrl:string = url.section(Section.Profile, {id: volunteer.id});
    return (
      <div className="VolunteerCard-root">
        <a className="VolunteerCard-volunteerName" href={volunteerUrl} target="_blank" rel="noopener noreferrer">
          <Avatar user={volunteer} size={50} />
        </a>
        <a className="VolunteerCard-volunteerName" href={volunteerUrl} target="_blank" rel="noopener noreferrer">
          {volunteer && (volunteer.first_name + " " + volunteer.last_name)}
        </a>
        {(this.props.isProjectAdmin || this.props.isProjectCoOwner) ? this._renderShowApplicationMenu() : null}
        <p className="VolunteerCard-volunteerRole">
          {roleTag && roleTag.display_name}
        </p>
      </div>
    );
  }

  _renderShowApplicationMenu(): ?React$Node {
    return (this.props.volunteer
      ?
        (<DropdownButton
          className="VolunteerCard-dropdownButton dropdown"
          size="lg"
          title={<span><i className={GlyphStyles.EllipsisV}></i></span>}
          id="VolunteerCard-dropdown"
          noCaret
          pullRight
        >
          {this._renderApplicationMenuLinks()}
        </DropdownButton>)
      :
        null
      );
  }

  _renderApplicationMenuLinks(): ?Array<React$Node> {
    const volunteer: VolunteerDetailsAPIData = this.props.volunteer;
    let links: ?Array<React$Node> = [];
    let key: number = 0;

    if (volunteer.isApproved) {
      if (volunteer.isCoOwner) {
        links = links.concat([
          (<MenuItem onSelect={() => this.props.onDemotionButton(this.props.volunteer)} key={key++}><i className={Glyph(GlyphStyles.Pushpin, GlyphWidth.Fixed)}></i> Demote</MenuItem>)
        ]);
      } else {
        links = links.concat([
          (<MenuItem onSelect={() => this.props.onPromotionButton(this.props.volunteer)} key={key++}><i className={Glyph(GlyphStyles.Pushpin, GlyphWidth.Fixed)}></i> Promote</MenuItem>)
        ]);
      }

      links = links.concat([
        (<MenuItem onSelect={() => this.props.onDismissButton(this.props.volunteer)} key={key++}><i className={Glyph(GlyphStyles.Delete, GlyphWidth.Fixed)}></i> Remove</MenuItem>)
      ]);
    } else {
      links = links.concat([
          (<MenuItem onSelect={() => this.props.onOpenApplication(this.props.volunteer)} key={key++}><i className={Glyph(GlyphStyles.Eye, GlyphWidth.Fixed)}></i> Review</MenuItem>),
          (<MenuItem onSelect={() => this.props.onApproveButton(this.props.volunteer)} key={key++}><i className={Glyph(GlyphStyles.Pushpin, GlyphWidth.Fixed)}></i> Approve</MenuItem>),
          (<MenuItem onSelect={() => this.props.onRejectButton(this.props.volunteer)} key={key++}><i className={Glyph(GlyphStyles.Delete, GlyphWidth.Fixed)}></i> Reject</MenuItem>),
      ]);
    }

    if(volunteer.user.id !== CurrentUser.userID()) {
      links = links.concat([
        (<MenuItem onSelect={() => this.props.onContactButton(this.props.volunteer)} key={key++} ><i className={Glyph(GlyphStyles.Envelope, GlyphWidth.Fixed)}></i> Contact</MenuItem>)
      ]);
    }

    return links;
  }
}

export default VolunteerCard;
