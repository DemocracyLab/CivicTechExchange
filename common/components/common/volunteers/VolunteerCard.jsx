// @flow

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";
import Avatar from "../avatar.jsx"
import {Glyph, GlyphStyles} from "../../utils/glyphs.js";


type Props = {|
  +volunteer: VolunteerDetailsAPIData,
  +isProjectAdmin: boolean,
  +isProjectCoOwner: boolean,
  +onOpenApplication: (VolunteerDetailsAPIData) => void,
  +onApproveButton: (VolunteerDetailsAPIData) => void,
  +onRejectButton: (VolunteerDetailsAPIData) => void,
  +onDismissButton: (VolunteerDetailsAPIData) => void,
  +onPromotionButton: (VolunteerDetailsAPIData) => void,
  +onDemotionButton: (VolunteerDetailsAPIData) => void
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
        {(this.props.isProjectAdmin || this.props.isProjectCoOwner) ? this._renderShowApplicationMenu(volunteer) : null}
        <p className="VolunteerCard-volunteerRole">
          {roleTag && roleTag.display_name}
        </p>
      </div>
    );
  }

  _renderShowApplicationMenu(volunteer): ?React$Node {
    return (this.props.volunteer
      ?
        (<DropdownButton
          bsClass="VolunteerCard-dropdownButton dropdown"
          bsStyle="default"
          title={<span><i className={GlyphStyles.EllipsisV}></i></span>}
          id="VolunteerCard-dropdown"
          noCaret
        >
          {this._renderApplicationMenuLinks()}
        </DropdownButton>)
      :
        null
      );
  }

  _renderApplicationMenuLinks(): ?Array<React$Node>  {
    if (this.props.volunteer && this.props.volunteer.isCoOwner) {
      return [
          (<MenuItem onSelect={() => this.props.onDemotionButton(this.props.volunteer)} key="0"><i className={GlyphStyles.Pushpin}></i> Demote</MenuItem>),
          (<MenuItem onSelect={() => this.props.onDismissButton(this.props.volunteer)} key="1"><i className={GlyphStyles.Delete}></i> Remove</MenuItem>)
        ]
    }
    if (this.props.volunteer && this.props.volunteer.isApproved) {
        return [
          (<MenuItem onSelect={() => this.props.onPromotionButton(this.props.volunteer)} key="0"><i className={GlyphStyles.Pushpin}></i> Promote</MenuItem>),
          (<MenuItem onSelect={() => this.props.onDismissButton(this.props.volunteer)} key="1"><i className={GlyphStyles.Delete}></i> Remove</MenuItem>)
        ]
    }
    if (this.props.volunteer) {
      return [
          (<MenuItem onSelect={() => this.props.onOpenApplication(this.props.volunteer)} key="2"><i className={GlyphStyles.Eye}></i> Review</MenuItem>),
          (<MenuItem onSelect={() => this.props.onApproveButton(this.props.volunteer)} key="3"><i className={GlyphStyles.Pushpin}></i> Approve</MenuItem>),
          (<MenuItem onSelect={() => this.props.onRejectButton(this.props.volunteer)} key="4"><i className={GlyphStyles.Delete}></i> Reject</MenuItem>)
      ];
    }
    return null;
  }
}

export default VolunteerCard;
