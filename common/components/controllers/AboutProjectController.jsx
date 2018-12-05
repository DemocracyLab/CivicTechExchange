// @flow

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
import {Earth, MapMarker, Clock, Domain, ChartBar, Key, Meetup, GithubCircle, Slack, Trello, GoogleDrive} from 'mdi-material-ui';
import Tooltip from '@material-ui/core/Tooltip';
class AboutProjectController extends React.Component {

 constructor(props){
  super(props);
  this.state = {
    project: null,
  }  
 }

    componentDidMount() {
    const projectId = (new RegExp("id=([^&]+)")).exec(document.location.search)[1];
    ProjectAPIUtils.fetchProjectDetails(projectId, this.loadProjectDetails.bind(this));

  }

  loadProjectDetails(project) {
    this.setState({
      project: project
    });
  }

  render() {
    const project = this.state.project;

    console.log(project);
    return (
      <div className='AboutProjects-root'>
        <Grid container className='AboutProjects-container' spacing={8}>

          <Grid item xs={3}>
            <Paper className='AboutProjects-paper' elevation={1}>

              <Grid className='AboutProjects-iconContainer'>
                <img className='AboutProjects-icon'src={project && project.project_thumbnail && project.project_thumbnail.publicUrl} />
              </Grid>

              <Divider />

              <Grid className='AboutProjects-details'>
                <div className="AboutProjects-icon-row">
                  <MapMarker/>
                  <p className="AboutProjects-icon-text">{project && project.project_location}</p>
                </div>
                <div className="AboutProjects-icon-row">
                  <Earth/>
                  <p className="AboutProjects-icon-text">{project && project.project_url}</p>
                </div>
                <div className="AboutProjects-icon-row">
                  <Clock/>
                  <p className="AboutProjects-icon-text">Updated 6 days ago</p>
                </div>
                <div className="AboutProjects-icon-row">
                  <Domain/>
                  <p className="AboutProjects-icon-text">Non profit</p>
                </div>
                <div className="AboutProjects-icon-row">
                  <ChartBar/>
                  <p className="AboutProjects-icon-text">{project && project.project_stage && project.project_stage[0].tag_name}</p>
                </div>
                <div className="AboutProjects-icon-row">
                  <Key/>
                  <p className="AboutProjects-icon-text">MIT License</p>
                </div>
              </Grid>
                

              <Divider />

              <Grid className='AboutProjects-links'>
                <p>Links</p>
                <div className="AboutProjects-links-icon-container">
                  <Tooltip title="meetup">
                    <Meetup/>
                  </Tooltip>
                  <Tooltip title="github">
                    <GithubCircle/>
                  </Tooltip>
                  <Tooltip title="slack">
                    <Slack/>
                  </Tooltip>
                  <Tooltip title="trello">
                    <Trello/>
                  </Tooltip>
                  <Tooltip title="googleDrive">
                    <GoogleDrive/>
                  </Tooltip>
                  <Tooltip title="website">
                    <Earth/>
                  </Tooltip>
                </div>
              </Grid>

              <Divider />

              <Grid className='AboutProjects-communities'>
                salutations
              </Grid>

              <Divider />

              <Grid className='AboutProjects-team'>
                hey
              </Grid>

            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Paper className='AboutProjects-paper' elevation={1}>

            </Paper>
          </Grid>

        </Grid>
      </div>
    )
  }
}

export default AboutProjectController;

// import type {ProjectDetailsAPIData} from '../utils/ProjectAPIUtils.js';
// import ProjectAPIUtils from '../utils/ProjectAPIUtils.js';
// import type {PositionInfo} from "../forms/PositionInfo.jsx";
// import ContactProjectButton from "../common/projects/ContactProjectButton.jsx";
// import NotificationModal from "../common/notification/NotificationModal.jsx";
// import TagsDisplay from '../common/tags/TagsDisplay.jsx'
// import url from '../utils/url.js'
// import CurrentUser from "../utils/CurrentUser.js";
// import VerifyEmailBlurb from "../common/notification/VerifyEmailBlurb.jsx";
// import _ from 'lodash'

// import React from 'react';
// import {Locations} from "../constants/ProjectConstants.js";
// import {LinkNames} from "../constants/LinkConstants.js";
// import {TagDefinition} from "../utils/ProjectAPIUtils.js";
// import ProjectVolunteerButton from "../common/projects/ProjectVolunteerButton.jsx";
// import VolunteerSection from "../common/volunteers/VolunteerSection.jsx";
// import GlyphStyles from "../utils/glyphs.js";

// type State = {|
//   project: ?ProjectDetailsAPIData,
//   showPositionModal: boolean,
//   shownPosition: ?PositionInfo
// |};

// class AboutProjectController extends React.PureComponent<{||}, State> {

//   constructor(): void {
//     super();
//     this.state = {
//       project: null,
//       showContactModal: false,
//       showPositionModal: false,
//       shownPosition: null
//     };

//     this.handleClose = this.handleClose.bind(this);
//   }

//   componentDidMount() {
//     const projectId = (new RegExp("id=([^&]+)")).exec(document.location.search)[1];
//     ProjectAPIUtils.fetchProjectDetails(projectId, this.loadProjectDetails.bind(this));
//   }

//   loadProjectDetails(project: ProjectDetailsAPIData) {
//     this.setState({
//       project: project
//     });
//   }

//   handleClose() {
//     this.setState({ showContactModal: false });
//   }

//   render(): React$Node {
//     return this.state.project ? this._renderDetails() : <div>Loading...</div>
//   }

//   _renderDetails(): React$Node {
//     const project = this.state.project;
//     return (
//       <div className="AboutProjectController-root">
//         <div className="container-fluid">
//           <div className="background-light">
//             <div className="row" style={{margin: "30px 0 0 0", padding: "10px 0"}}>
//               <div className="col-sm-5">
//                 <div className="row">
//                   <div className="col-sm-auto">
//                     <img className="upload_img upload_img_bdr" src={project && project.project_thumbnail && project.project_thumbnail.publicUrl} />
//                   </div>
//                   <div className="col">
//                     <div className="row">
//                       <div className="col">
//                         {project && project.project_name}
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col">
//                         {project && !_.isEmpty(project.project_issue_area) ? "Issue Area: " + project.project_issue_area[0].display_name : null}
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col">
//                         {project && !_.isEmpty(project.project_stage) ? "Project Stage: " + project.project_stage[0].display_name : null}
//                       </div>
//                     </div>
//                     <div className="row">
//                       {this._renderProjectCommunity()}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col">
//               </div>
//               <div className="col col-sm-3">
//                 <div className="row">
//                   {this._renderProjectHomepageLink()}
//                 </div>
//                 <div className="row">
//                   {this._renderProjectLocation()}
//                 </div>
//                 <div className="row">
//                   <ContactProjectButton project={this.state.project}/>
//                 </div>
//                 <div className="row">
//                   <ProjectVolunteerButton project={this.state.project}/>
//                   { CurrentUser.isLoggedIn() && !CurrentUser.isEmailVerified() && <VerifyEmailBlurb/> }
//                 </div>
//               </div>
//             </div>
//           </div>

//           {
//             project && !_.isEmpty(project.project_technologies)
//               ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
//                   <div className='col'>
//                     <h2 className="form-group subheader">TECHNOLOGIES USED</h2>
//                     <div className="Text-section">
//                       {this._renderTechnologies()}
//                     </div>
//                   </div>
//                 </div>
//               : null
//           }
  
//           {
//             project && !_.isEmpty(project.project_short_description)
//             ? < div className="row" style={{margin: "30px 40px 0 40px"}}>
//                 <div className="col">
//                   <h2 className="form-group subheader">PROJECT SUMMARY</h2>
//                   <div className="Text-section" style={{whiteSpace: "pre-wrap"}}>
//                     {project.project_short_description}
//                   </div>
//                 </div>
//               </div>
//             : null
//           }

//           <div className="row" style={{margin: "30px 40px 0 40px"}}>
//             <div className="col">
//               <h2 className="form-group subheader">PROJECT DETAILS</h2>
//               <div className="Text-section" style={{whiteSpace: "pre-wrap"}}>
//                 {project && project.project_description}
//               </div>
//             </div>
//           </div>

//           <NotificationModal
//             showModal={this.state.showPositionModal}
//             message={this.state.shownPosition && this.state.shownPosition.description}
//             buttonText="Close"
//             headerText={this.state.shownPosition && this.state.shownPosition.roleTag.display_name}
//             onClickButton={() => this.setState({showPositionModal: false})}
//           />

//           {
//             project && !_.isEmpty(project.project_positions)
//               ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
//                   <div className='col'>
//                     <h2 className="form-group subheader">SKILLS NEEDED</h2>
//                     <div className="Text-section">
//                       {this._renderPositions()}
//                     </div>
//                   </div>
//                 </div>
//               : null
//           }
  
//           {
//             project && !_.isEmpty(project.project_volunteers)
//               ? <VolunteerSection
//                   volunteers={project.project_volunteers}
//                   isProjectAdmin={CurrentUser.userID() === project.project_creator}
//                 />
//               : null
//           }

//           {
//             project && !_.isEmpty(project.project_links)
//               ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
//                   <div className='col'>
//                     <h2 className="form-group subheader">LINKS</h2>
//                     <div className="Text-section">
//                       {this._renderLinks()}
//                     </div>
//                   </div>
//                 </div>
//               : null
//           }

//           {
//             project && !_.isEmpty(project.project_files)
//               ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
//                   <div className='col'>
//                     <h2 className="form-group subheader">FILES</h2>
//                     <div className="Text-section">
//                       {this._renderFiles()}
//                     </div>
//                   </div>
//                 </div>
//               : null
//           }
//         </div>
//         <div>
//           <i>Last Updated:</i> {project.project_date_modified}
//         </div>
//       </div>
//     );
//   }

//   _renderProjectLocation(): React$Node {
//     if(this.state.project && this.state.project.project_location && (this.state.project.project_location !== Locations.OTHER)) {
//       return <div className="col">
//         <i className={GlyphStyles.MapMarker} aria-hidden="true"></i>
//         {this.state.project.project_location}
//       </div>
//     }
//   }

//   _renderProjectCommunity(): React$Node {
//     if(this.state.project && !_.isEmpty(this.state.project.project_organization)) {
//       return <div className="col">
//         Communities: {_.join(this.state.project.project_organization.map((tag: TagDefinition) => tag.display_name), ", ")}
//       </div>
//     }
//   }

//   _renderProjectHomepageLink(): React$Node {
//     if(this.state.project && this.state.project.project_url) {
//       return <div className="col">
//         <i className={GlyphStyles.Globe} aria-hidden="true"></i>
//         <a href={this.state.project.project_url} target="_blank" rel="noopener noreferrer">
//           {this.state.project.project_url.length > 100 ? "Project Homepage" : url.beautify(this.state.project.project_url)}
//         </a>
//       </div>
//     }
//   }

//   _renderTechnologies(): ?Array<React$Node> {
//     const project = this.state.project;
//     return project && project.project_technologies &&
//       <TagsDisplay tags={project && project.project_technologies}/>
//   }


//   _renderLinks(): ?Array<React$Node> {
//     const project = this.state.project;
//     return project && project.project_links && project.project_links.map((link, i) =>
//       <div key={i}>
//         <a href={link.linkUrl} target="_blank" rel="noopener noreferrer">{this._legibleName(link.linkName)}</a>
//       </div>
//     );
//   }

//   _renderFiles(): ?Array<React$Node> {
//     const project = this.state.project;
//     return project && project.project_files && project.project_files.map((file, i) =>
//       <div key={i}>
//         <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
//       </div>
//     );
//   }

//   _renderPositions(): ?Array<React$Node> {
//     const project = this.state.project;
//     return project && project.project_positions && _.chain(project.project_positions).sortBy(['roleTag.subcategory', 'roleTag.display_name']).value()
//       .map((position, i) => {
//         const positionDisplay = position.roleTag.subcategory + ":" + position.roleTag.display_name;
//         return (
//             <div key={i}>
//             {
//               position.descriptionUrl
//               ? <a href={position.descriptionUrl} target="_blank" rel="noopener noreferrer">{positionDisplay}</a>
//               : <span>{positionDisplay}</span>
//             }
//             </div>
//           );
//       });
//   }
  

//   _legibleName(input) {
//     //replaces specific linkNames for readability
//     return LinkNames[input] || input;
//   }
// }

