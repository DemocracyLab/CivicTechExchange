// @flow

import React from "react";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import TagsDisplay from "../common/tags/TagsDisplay.jsx";
import { FileCategoryNames } from "../constants/FileConstants.js";
import { UserAPIData } from "../utils/UserAPIUtils.js";
import UserAPIUtils from "../utils/UserAPIUtils.js";
import { FileInfo } from "../common/FileInfo.jsx";
import Avatar from "../common/avatar.jsx";
import LoadingMessage from "../chrome/LoadingMessage.jsx";
import url from "../utils/url.js";
import IconLinkDisplay from "../componentsBySection/AboutProject/IconLinkDisplay.jsx";
import Section from "../enums/Section.js";
import CurrentUser from "../utils/CurrentUser.js";
import { Glyph, GlyphSizes, GlyphStyles } from "../utils/glyphs.js";
import EditUserNameModal from "../componentsBySection/AboutUser/EditUserNameModal.jsx";
import EditUserBioModal from "../componentsBySection/AboutUser/EditUserBioModal.jsx";
import EditUserLinksModal from "../componentsBySection/AboutUser/EditUserLinksModal.jsx";
import EditUserFilesModal from "../componentsBySection/AboutUser/EditUserFilesModal.jsx";
import EditUserThumbnailModal from "../componentsBySection/AboutUser/EditUserThumbnailModal.jsx";
import EditUserTagsModal from "../componentsBySection/AboutUser/EditUserTagsModal.jsx";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

type State = {|
  user: ?UserAPIData,
  isUserOrAdmin: boolean,
  showEditNameModal: boolean,
  showEditBioModal: boolean,
  showEditLinksModal: boolean,
  showEditFilesModal: boolean,
  showEditThumbnailModal: boolean,
  showEditTagsModal: boolean,
|};

class AboutUserController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();

    this.state = {
      user: null,
      isUserOrAdmin: false,
      showEditNameModal: false,
      showEditBioModal: false,
      showEditLinksModal: false,
      showEditFilesModal: false,
      showEditThumbnailModal: false,
      showEditTagsModal: false,
    };
  }

  componentDidMount() {
    UserAPIUtils.fetchUserDetails(
      url.argument("id"),
      this.loadUserDetails.bind(this)
    );
  }

  loadUserDetails(user: UserAPIData) {
    this.setState({
      user: user,
      isUserOrAdmin: CurrentUser.userID() === user.id || CurrentUser.isStaff(),
    });
  }

  render(): React$Node {
    return this.state.user ? (
      this._renderDetails()
    ) : (
      <LoadingMessage message="Loading profile..." />
    );
  }

  onClickEdit(showEditModalState: string) {
    const state: State = {};
    state[showEditModalState] = true;
    this.setState(state);
  }

  onSaveUserChanges(showEditModalState: string, user: UserAPIData) {
    const state: State = { user: user };
    state[showEditModalState] = false;
    this.setState(state);
  }

  _renderDetails(): React$Node {
    const user: UserAPIData = this.state.user;
    return (
      <React.Fragment>
        {user && this._renderEditUserModals()}
        <div className="AboutUser-root container">
          <div className="row background-light about-user-section">
            <div className="col-12 col-lg-4 col-xxl-3 left-column">
              {this._renderLeftColumn(user)}
            </div>
            <div className="col-12 col-lg-8 col-xxl-9 right-column">
              {this._renderRightColumn(user)}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderLeftColumn(user: UserAPIData): React$Node {
    return (
      <React.Fragment>
        <div className="about-user-section d-flex justify-content-between">
          <Avatar user={user} imgClass="AboutUser-profile-img" />
          {this._renderEditControl("showEditThumbnailModal")}
        </div>

        <div className="about-user-section d-flex justify-content-between">
          <h3>{user && user.first_name + " " + user.last_name}</h3>
          {this._renderEditControl("showEditNameModal")}
        </div>
        {/* TODO: conditional render, everything else for badges */}
        <div className="about-user-section">
          <h3>Badges</h3>
          <div>{this._renderBadges(user)}</div>
        </div>
        {!_.isEmpty(user.user_links) || this.state.isUserOrAdmin ? (
          <div className="about-user-section">
            <span className="d-flex justify-content-between">
              <h3>Links</h3>
              {this._renderEditControl("showEditLinksModal")}
            </span>
            <div>{this._renderLinks(user)}</div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
  
  _renderRightColumn(user: UserAPIData): React$Node {
    return (
     <div class="AboutUser-tab-container">
      <h2>Hi, user.user_firstname and log activity button conditional render goes here</h2>
      {this._renderUserTabs(user)}
    </div>
    )
  }

  _renderUserTabs(user: UserAPIData): React$Node {
    // TODO: remove landing controller styles, add AboutUser- styles
    return (
      <Tabs
      defaultActiveKey="t-aboutme"
      id="about-tabs"
      className="LandingController-tabs"
      justify
    >
      <Tab eventKey="t-aboutme" title="About Me">
        {this._aboutMeTab(user)}
      </Tab>
      <Tab eventKey="t-myactivity" title="My Activity">
        {this._myActivityTab(user)}
      </Tab>
    </Tabs>
    )
  }



  _aboutMeTab(user: UserAPIData): React$Node {
    return (
      <React.Fragment>
      {(user.about_me || this.state.isUserOrAdmin) &&
        this._renderAboutMe(user)}

      {user &&
      (!_.isEmpty(user.user_technologies) || this.state.isUserOrAdmin)
        ? this._renderAreasOfInterest(user)
        : null}

      {!_.isEmpty(user.user_files) || this.state.isUserOrAdmin ? (
        <div className="about-user-section">
          <span className="d-flex justify-content-between">
            <h2>Files</h2>
            {this._renderEditControl("showEditFilesModal")}
          </span>
          <div>{this._renderFiles()}</div>
        </div>
      ) : null}
    </React.Fragment>
    )
  }
  _myActivityTab(user: UserAPIData): React$Node {
    return (
      <p>@@@ PLACEHOLDER FOR MY ACTIVITY TAB CONTENT @@@</p>
    )
  }

  _renderAboutMe(user: UserAPIData): React$Node {
    return (
      <div className="about-user-section">
        <h2>About Me</h2>
        <div className="d-flex justify-content-between">
          <h3>Bio</h3>
          {this._renderEditControl("showEditBioModal")}
        </div>
        <div className="bio-text" style={{ whiteSpace: "pre-wrap" }}>
          {user.about_me}
        </div>
      </div>
    );
  }

  _renderAreasOfInterest(user: UserAPIData): React$Node {
    return (
      <div className="about-user-section">
        <h2>Areas of Interest</h2>
        <span className="d-flex justify-content-between">
          <h3>Technologies Used</h3>
          {this._renderEditControl("showEditTagsModal")}
        </span>
        <TagsDisplay tags={user && user.user_technologies} />
      </div>
    );
  }

  _renderBadges(user: userAPIData) {
    return (
      <p>@@@ PLACEHOLDER FOR BADGES @@@</p>
    )
  }

  _renderLinks(user: UserAPIData): ?Array<React$Node> {
    return (
      user &&
      user.user_links &&
      user.user_links.map((link, i) => <IconLinkDisplay key={i} link={link} />)
    );
  }

  _renderFiles(): ?Array<React$Node> {
    const user = this.state.user;
    return (
      user &&
      user.user_files &&
      user.user_files.map((file, i) => (
        <div className="AboutUser-file-list" key={i}>
          <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">
            {this._legibleFileName(file)}
          </a>
        </div>
      ))
    );
  }

  _renderEditUserModals(): React$Node {
    return (
      <React.Fragment>
        <EditUserNameModal
          showModal={this.state.showEditNameModal}
          user={this.state.user}
          onEditClose={this.onSaveUserChanges.bind(this, "showEditNameModal")}
        />
        <EditUserBioModal
          showModal={this.state.showEditBioModal}
          user={this.state.user}
          onEditClose={this.onSaveUserChanges.bind(this, "showEditBioModal")}
        />
        <EditUserLinksModal
          showModal={this.state.showEditLinksModal}
          user={this.state.user}
          onEditClose={this.onSaveUserChanges.bind(this, "showEditLinksModal")}
        />
        <EditUserFilesModal
          showModal={this.state.showEditFilesModal}
          user={this.state.user}
          onEditClose={this.onSaveUserChanges.bind(this, "showEditFilesModal")}
        />
        <EditUserFilesModal
          showModal={this.state.showEditFilesModal}
          user={this.state.user}
          onEditClose={this.onSaveUserChanges.bind(this, "showEditFilesModal")}
        />
        <EditUserThumbnailModal
          showModal={this.state.showEditThumbnailModal}
          user={this.state.user}
          onEditClose={this.onSaveUserChanges.bind(
            this,
            "showEditThumbnailModal"
          )}
        />
        <EditUserTagsModal
          showModal={this.state.showEditTagsModal}
          user={this.state.user}
          onEditClose={this.onSaveUserChanges.bind(this, "showEditTagsModal")}
        />
      </React.Fragment>
    );
  }

  _renderEditControl(modalShowVariable: string): ?React$Node {
    return (
      this.state.isUserOrAdmin && (
        <i
          className={Glyph(GlyphStyles.Edit, GlyphSizes.LG)}
          aria-hidden="true"
          onClick={this.onClickEdit.bind(this, modalShowVariable)}
        ></i>
      )
    );
  }

  _legibleFileName(input: FileInfo) {
    //replaces specific file names for readability
    return FileCategoryNames[input.fileCategory] || input.fileName;
  }
}

export default AboutUserController;
