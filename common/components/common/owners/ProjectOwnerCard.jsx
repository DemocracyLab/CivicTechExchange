// @flow

import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {UserAPIData} from "../../utils/UserAPIUtils.js";
import {TagDefinition, VolunteerUserData} from "../../utils/ProjectAPIUtils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";

type Props = {|
  +owner: VolunteerUserData,
  // +isProjectAdmin: boolean,
  // +onOpenApplication: (VolunteerDetailsAPIData) => void,
  // +onApproveButton: (VolunteerDetailsAPIData) => void,
  // +onRejectButton: (VolunteerDetailsAPIData) => void,
  // +onDismissButton: (VolunteerDetailsAPIData) => void
|};

class ProjectOwnerCard extends React.PureComponent<Props> {
  
  render(): React$Node {
    console.log('ProjectOwnerCard render', this.props)
    const owner: ?VolunteerUserData = this.props.owner;
    // const roleTag: ?TagDefinition = this.props.volunteer.roleTag;
    const ownerUrl:string = owner.user_thumbnail && owner.user_thumbnail.publicUrl;
    return (
      <div className="VolunteerCard-root">
        <a className="VolunteerCard-volunteerName" href={ownerUrl} target="_blank" rel="noopener noreferrer">
          <img className="upload_img upload_img_bdr VolunteerCard-img" src={owner && owner.user_thumbnail && owner.user_thumbnail.publicUrl}/>
        </a>
        <a className="VolunteerCard-volunteerName" href={ownerUrl} target="_blank" rel="noopener noreferrer">
          {owner && (owner.first_name + " " + owner.last_name)}
        </a> 
        {/* {this.props.isProjectAdmin ? this._renderShowApplicationMenu(volunteer) : null} */}
        <p className="VolunteerCard-volunteerRole">
          Project Owner
        </p>
      </div>
    );
  }
  
  // _renderShowApplicationMenu(volunteer): ?React$Node {
  //   return (this.props.volunteer
  //     ? 
  //       (<DropdownButton
  //         bsClass="VolunteerCard-dropdownButton dropdown"
  //         bsStyle="default"
  //         bsSize="small"
  //         title="..."
  //         noCaret
  //       >
  //         {this._renderApplicationMenuLinks()}
  //       </DropdownButton>)
  //     : 
  //       null
  //     );
  // }

  // _renderApplicationMenuLinks(): ?Array<React$Node>  {
  //   return (this.props.volunteer && this.props.volunteer.isApproved
  //     ? [
  //         (<MenuItem className="VolunteerCard-danger" onSelect={() => this.props.onDismissButton(this.props.volunteer)} key="1">Remove</MenuItem>)
  //       ]
  //     : [
  //         (<MenuItem onSelect={() => this.props.onOpenApplication(this.props.volunteer)} key="2">Application</MenuItem>),
  //         (<MenuItem className="VolunteerCard-success" onSelect={() => this.props.onApproveButton(this.props.volunteer)} key="3">Accept</MenuItem>),
  //         (<MenuItem className="VolunteerCard-danger" onSelect={() => this.props.onRejectButton(this.props.volunteer)} key="4">Reject</MenuItem>)
  //     ]);
  // }
}

export default ProjectOwnerCard;
