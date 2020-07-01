// @flow

import React from 'react';
import _ from 'lodash'
import type {GroupDetailsAPIData} from '../../utils/GroupAPIUtils.js';
import GroupDetails from "./GroupDetails.jsx";
import ContactGroupButton from "./ContactGroupButton.jsx";
import IconLinkDisplay from "../../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import CurrentUser from "../../utils/CurrentUser.js";
import Headers from "../Headers.jsx";
import Truncate from "../../utils/truncate.js";
import Sort from "../../utils/sort.js";
import {LinkTypes} from "../../constants/LinkConstants.js";
import GroupAPIUtils from "../../utils/GroupAPIUtils.js";
import ProjectCard from "../../componentsBySection/FindProjects/ProjectCard.jsx";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";


type Props = {|
  group: ?GroupDetailsAPIData,
  viewOnly: boolean
|};

type State = {|
  group: ?GroupDetailsAPIData,
  showJoinModal: boolean
|};

class AboutGroupDisplay extends React.PureComponent<Props, State> {

  constructor(props: Props): void{
    super(props);
    this.state = {
      group: props.group,
      showContactModal: false,
    };
 }
  
  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      group: nextProps.group,
      volunteers: nextProps.group.group_volunteers
    });
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

          <div className='AboutProjects-details'>
            <GroupDetails
              groupUrl={group && group.group_url}
              groupLocation={group && GroupAPIUtils.getLocationDisplayName(group)}
              projectCount={group.group_projects && group.group_projects.length}
            />
          </div>

          {group && !_.isEmpty(group.group_links) &&
            <React.Fragment>
              <div className='AboutProjects-links'>
                <h4>Links</h4>
                {this._renderLinks()}
              </div>
            </React.Fragment>
          }
          
        </div>

        <div className="AboutProjects-mainColumn">

          <div className='AboutProjects-intro'>
            <div className='AboutProjects-introTop'>
              <div className='AboutProjects-description'>
                <h1>{group && group.group_name}</h1>
                <p>{group && group.group_short_description}</p>
              </div>

              {!this.props.viewOnly && this._renderContactAndVolunteerButtons()}

            </div>

            <div className="AboutProjects_tabs">

            </div>
          </div>

          <div className='AboutProjects-details'>
            <div id='group-details'>
              {group.group_description}
            </div>

            <div className='AboutProjects-skills-container'>
{/*TODO: Issue areas*/}
            </div>
            
            {this.state.group.group_projects && this._renderProjectList()}
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
  
  _renderProjectList(): ?$React$Node {
    return (
      <React.Fragment>
        {this.state.group.group_projects.map(
          (project, index) => {
            return (
              <div className="col-sm-12 col-lg-6">
                <ProjectCard
                  project={ProjectAPIUtils.projectFromAPIData(project)}
                  key={index}
                  textlen={140}
                  skillslen={4}
                />
              </div>
            );
        })}
      </React.Fragment>
    );
  }
}

export default AboutGroupDisplay;
