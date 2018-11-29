// @flow

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";

type Props = {|
  +volunteer: VolunteerDetailsAPIData,
  +isProjectAdmin: boolean,
  +onOpenApplication: (VolunteerDetailsAPIData) => void,
  +onApproveButton: (VolunteerDetailsAPIData) => void,
  +onRejectButton: (VolunteerDetailsAPIData) => void,
  +onDismissButton: (VolunteerDetailsAPIData) => void
|};

class VolunteerCard extends React.PureComponent<Props> {
  
  render(): React$Node {
    const volunteer: ?UserAPIData = this.props.volunteer.user;
    const roleTag: ?TagDefinition = this.props.volunteer.roleTag;
    const volunteerUrl:string = url.section(Section.Profile, {id: volunteer.id});
    return (
      <div className="MyProjectCard-root">
        <a className="MyProjectCard-volunteerName" href={volunteerUrl} target="_blank" rel="noopener noreferrer">
        <img className="upload_img upload_img_bdr MyProjectCard-img" src={volunteer && volunteer.user_thumbnail && volunteer.user_thumbnail.publicUrl}/>
        </a>
        <a className="MyProjectCard-volunteerName" href={volunteerUrl} target="_blank" rel="noopener noreferrer">
        {volunteer && (volunteer.first_name + " " + volunteer.last_name)}
        </a> {this.props.isProjectAdmin ? this._renderShowApplicationMenu() : null}
        <p className="MyProjectCard-volunteerRole">{roleTag && roleTag.display_name}</p>
      </div>
    );
  }
  
  _renderShowApplicationMenu(): ?React$Node {
    return (this.props.volunteer
      ? 
        (<DropdownButton
          bsClass="MyProjectCard-dropdownButton dropdown"
          bsStyle="default"
          bsSize="small"
          title="..."
          noCaret
          id="volunteercard-no-caret"
        >
          {this._renderApplicationMenuLinks()}
        </DropdownButton>)
      : 
        null
      );
  }

  _renderApplicationMenuLinks(): ?Array<React$Node>  {
    return (this.props.volunteer && this.props.volunteer.isApproved
      ? [
          (<MenuItem className="MyProjectCard-danger" onSelect={() => this.props.onDismissButton(this.props.volunteer)} key="1">Remove</MenuItem>)
        ]
      : [
          (<MenuItem onSelect={() => this.props.onOpenApplication(this.props.volunteer)} key="2">Application</MenuItem>),
          (<MenuItem className="MyProjectCard-success" onSelect={() => this.props.onApproveButton(this.props.volunteer)} key="3">Accept</MenuItem>),
          (<MenuItem className="MyProjectCard-danger" onSelect={() => this.props.onRejectButton(this.props.volunteer)} key="4">Reject</MenuItem>)
      ]);
  }
}

export default VolunteerCard;
