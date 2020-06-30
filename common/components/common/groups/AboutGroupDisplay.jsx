// @flow

import React from 'react';
import _ from 'lodash'
import type {GroupDetailsAPIData} from '../../utils/GroupAPIUtils.js';
// import GroupDetails from '../../componentsBySection/FindGroups/GroupDetails.jsx';
import ContactGroupButton from "./ContactGroupButton.jsx";
import ContactVolunteersButton from "./ContactVolunteersButton.jsx";
import GroupVolunteerButton from "./GroupVolunteerButton.jsx";
import GroupVolunteerModal from "./GroupVolunteerModal.jsx";
import AboutPositionEntry from "../positions/AboutPositionEntry.jsx";
import ProjectOwnersSection from "../owners/ProjectOwnersSection.jsx";
import VolunteerSection from "../volunteers/VolunteerSection.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import type {PositionInfo} from "../../forms/PositionInfo.jsx";
import CurrentUser from "../../utils/CurrentUser.js";
import Headers from "../Headers.jsx";
import Truncate from "../../utils/truncate.js";
import Sort from "../../utils/sort.js";
import {LinkTypes} from "../../constants/LinkConstants.js";
import DropdownMenu from "react-bootstrap/DropdownMenu";


type Props = {|
  group: ?GroupDetailsAPIData,
  viewOnly: boolean
|};

type State = {|
  group: ?GroupDetailsAPIData,
  volunteers: ?$ReadOnlyArray<VolunteerDetailsAPIData>,
  showJoinModal: boolean,
  positionToJoin: ?PositionInfo,
  showPositionModal: boolean,
  shownPosition: ?PositionInfo,
  tabs: object
|};

class AboutGroupDisplay extends React.PureComponent<Props, State> {

  constructor(props: Props): void{
    super(props);
    this.state = {
      group: props.group,
      volunteers: props.group && props.group.group_volunteers,
      showContactModal: false,
      showPositionModal: false,
      shownPosition: null,
      tabs: {
        details: true,
        skills: false,
      }
    };
    this.handleUpdateVolunteers = this.handleUpdateVolunteers.bind(this);
 }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      group: nextProps.group,
      volunteers: nextProps.group.group_volunteers
    });
  }

  handleShowVolunteerModal(position: ?PositionInfo) {
    this.setState({
      showJoinModal: true,
      positionToJoin: position
    });
  }
  
  handleUpdateVolunteers(volunteers: $ReadOnlyArray<VolunteerDetailsAPIData>) {
    this.setState({
      volunteers: volunteers
    });
  }

  confirmJoinGroup(confirmJoin: boolean) {
    if(confirmJoin) {
      window.location.reload(true);
    } else {
      this.setState({showJoinModal: false});
    }
  }

  changeHighlighted(tab) {
   let tabs = {
      details: false,
      skills: false,
      positions: false,
    };

    tabs[tab] = true;
    this.setState({tabs});
  }

  render(): $React$Node {
    return this.state.group ? this._renderDetails() : <div>{this.state.loadStatusMsg}</div>
  }

  _renderDetails(): React$Node {
    const group = this.state.group;
    return (
      <div className='AboutProjects-root'>
        {this._renderHeader(group)}
        <div className="AboutProjects-infoColumn">

          <div className='AboutProjects-iconContainer'>
            <img className='AboutProjects-icon'src={group && group.group_thumbnail && group.group_thumbnail.publicUrl} />
          </div>

          {/* <div className='AboutProjects-details'>
            <GroupDetails
              groupLocation={group && group.group_location}
              groupUrl={group && group.group_url}
              groupStage={group && !_.isEmpty(group.group_stage) ? group.group_stage[0].display_name : null}
              groupOrganizationType={group && !_.isEmpty(group.group_organization_type) ? group.group_organization_type[0].display_name : null}
              dateModified={group && group.group_date_modified}
            />
          </div> */}

          {group && !_.isEmpty(group.group_links) &&
            <React.Fragment>
              <div className='AboutProjects-links'>
                <h4>Links</h4>
                {this._renderLinks()}
              </div>

            </React.Fragment>
          }

          { group && !_.isEmpty(group.group_files) &&
            <React.Fragment>
              <div className='AboutProjects-files'>
                <h4>Files</h4>
                  {this._renderFiles()}
              </div>

            </React.Fragment>
          }

          {group && !_.isEmpty(group.group_organization) &&
            <React.Fragment>
              <div className='AboutProjects-communities'>
                <h4>Communities</h4>
                <ul>
                  {
                    group.group_organization.map((org, i) => {
                      return <li key={i}>{org.display_name}</li>
                    })
                  }
                </ul>
              </div>

            </React.Fragment>
          }

          <div className='AboutProjects-team'>
            {
            !_.isEmpty(this.state.volunteers)
              ? <VolunteerSection
                  volunteers={this.state.volunteers}
                  isGroupAdmin={CurrentUser.userID() === group.group_creator}
                  isGroupCoOwner={CurrentUser.isCoOwner(group)}
                  groupId={group.group_id}
                  renderOnlyPending={true}
                  onUpdateVolunteers={this.handleUpdateVolunteers}
                />
              : null
            }
            <h4>Team</h4>
              {
                group && !_.isEmpty(group.group_owners)
                ? <ProjectOwnersSection
                    owners={group.group_owners}
                  />
                : null
              }

              {
              !_.isEmpty(this.state.volunteers)
                ? <VolunteerSection
                    volunteers={this.state.volunteers}
                    isGroupAdmin={CurrentUser.userID() === group.group_creator}
                    isGroupCoOwner={CurrentUser.isCoOwner(group)}
                    groupId={group.group_id}
                    renderOnlyPending={false}
                    onUpdateVolunteers={this.handleUpdateVolunteers}
                  />
                : null
              }
          </div>

        </div>

        <div className="AboutProjects-mainColumn">

          <div className='AboutProjects-intro'>
            <div className='AboutProjects-introTop'>
              <div className='AboutProjects-description'>
                <h1>{group && group.group_name}</h1>
                <p className='AboutProjects-description-issue'>{group && group.group_issue_area && group.group_issue_area.map(issue => issue.display_name).join(',')}</p>
                <p>{group && group.group_short_description}</p>
              </div>

              <GroupVolunteerModal
                groupId={this.state.group && this.state.group.group_id}
                positions={this.state.group && this.state.group.group_positions}
                positionToJoin={this.state.positionToJoin}
                showModal={this.state.showJoinModal}
                handleClose={this.confirmJoinGroup.bind(this)}
              />

              {!this.props.viewOnly && this._renderContactAndVolunteerButtons()}

            </div>

            <div className="AboutProjects_tabs">

              <a onClick={() => this.changeHighlighted('details')} className={this.state.tabs.details ? 'AboutProjects_aHighlighted' : 'none'}href="#group-details">Details</a>

              {group && !_.isEmpty(group.group_positions) &&
              <a onClick={() => this.changeHighlighted('skills')} className={this.state.tabs.skills ? 'AboutProjects_aHighlighted' : 'none'} href="#positions-available">Skills Needed</a>
              }

            </div>
          </div>

          <div className='AboutProjects-details'>
            <div id='group-details'>
              {group.group_description}
              {!_.isEmpty(group.group_description_solution) && 
                <React.Fragment>
                  <div>
                    <br></br>
                    {group.group_description_solution}
                  </div>
                </React.Fragment>
              }
              {!_.isEmpty(group.group_description_actions) && 
                <React.Fragment>
                  <div>
                    <br></br>
                    {group.group_description_actions}
                  </div>
                </React.Fragment>
              }
            </div>

            <div className='AboutProjects-skills-container'>

              {group && !_.isEmpty(group.group_positions) &&
                <div className='AboutProjects-skills'>
                  <p id='skills-needed' className='AboutProjects-skills-title'>Skills Needed</p>
                  {group && group.group_positions && group.group_positions.map(position => <p>{position.roleTag.display_name}</p>)}
                </div>
              }

              {group && !_.isEmpty(group.group_technologies) &&
                <div className='AboutProjects-technologies'>
                  <p className='AboutProjects-tech-title'>Technologies Used</p>
                  {group && group.group_technologies && group.group_technologies.map(tech => <p>{tech.display_name}</p>)}
                </div>
              }

            </div>
          </div>

          <div className='AboutProjects-positions-available'>
            <div id="positions-available">
              {group && !_.isEmpty(group.group_positions) && this._renderPositions()}
            </div>
          </div>

        </div>

      </div>
    )
  }

  _renderHeader(group: GroupDetailsAPIData): React$Node {
    const title: string = group.group_name + " | DemocracyLab";
    const description: string = group.group_short_description || Truncate.stringT(group.group_description, 300);

    return (
      <Headers
        title={title}
        description={description}
        thumbnailUrl={group.group_thumbnail && group.group_thumbnail.publicUrl}
      />
    );
  }
  
  _renderContactAndVolunteerButtons(): React$Node {
    return (
      <div className='AboutProjects-owner'>
        <ContactGroupButton group={this.state.group}/>
        <ContactVolunteersButton group={this.state.group}/>
        <GroupVolunteerButton
          group={this.state.group}
          onVolunteerClick={this.handleShowVolunteerModal.bind(this)}
        />
      </div>
    );
  }

  _renderFiles(): ?Array<React$Node> {
    const group = this.state.group;
    return group && group.group_files && group.group_files.map((file, i) =>
      <div key={i}>
        <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
      </div>
    );
  }

  _renderLinks(): ?Array<React$Node> {
    const group = this.state.group;
    const linkOrder = [LinkTypes.CODE_REPOSITORY, LinkTypes.FILE_REPOSITORY, LinkTypes.MESSAGING, LinkTypes.GROUP_MANAGEMENT];
    const sortedLinks = group && group.group_links && Sort.byNamedEntries(group.group_links, linkOrder, (link) => link.linkName);
    return sortedLinks.map((link, i) =>
      <IconLinkDisplay key={i} link={link}/>
    );
  }

  _renderPositions(): ?Array<React$Node> {
    const group: GroupDetailsAPIData = this.state.group;
    const canApply: boolean = CurrentUser.canVolunteerForGroup(group);
    return group && group.group_positions && _.chain(group.group_positions).sortBy(['roleTag.subcategory', 'roleTag.display_name']).value()
      .map((position, i) => {
        return <AboutPositionEntry
          key={i}
          group={group}
          position={position}
          onClickApply={canApply ? this.handleShowVolunteerModal.bind(this, position) : null}
        />;
      });
    }
}

export default AboutGroupDisplay;
