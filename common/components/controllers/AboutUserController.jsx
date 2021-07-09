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

type State = {|
  user: ?UserAPIData,
  showEditNameModal: boolean,
|};

class AboutUserController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();

    this.state = {
      user: null,
      showEditNameModal: false,
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
    const showEdit: boolean =
      CurrentUser.isLoggedIn() && CurrentUser.userID() === user.id;
    return (
      <React.Fragment>
        {showEdit && this._renderEditUserButton()}
        <div className="about-user-section">
          <Avatar user={user} imgClass="Profile-img" />
        </div>

        <div className="about-user-section side-by-side">
          <h3>{user && user.first_name + " " + user.last_name}</h3>
          <span>
            <i
              className={Glyph(GlyphStyles.Edit, GlyphSizes.LG)}
              aria-hidden="true"
              onClick={this.onClickEdit.bind(this, "showEditNameModal")}
            ></i>
          </span>
        </div>
        {!_.isEmpty(user.user_links) ? (
          <div className="about-user-section">
            <h3>Links</h3>
            <div>{this._renderLinks(user)}</div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }

  _renderRightColumn(user: UserAPIData): React$Node {
    return (
      <React.Fragment>
        {user.about_me && this._renderAboutMe(user)}

        {user && !_.isEmpty(user.user_technologies)
          ? this._renderAreasOfInterest(user)
          : null}

        {user && !_.isEmpty(user.user_files) ? (
          <div className="about-user-section">
            <h2 className="text-uppercase">Files</h2>
            <div>{this._renderFiles()}</div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }

  _renderAboutMe(user: UserAPIData): React$Node {
    return (
      <div className="about-user-section">
        <h2>About Me</h2>
        <h3>Bio</h3>
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
        <hr />
        <h3>Technologies Used</h3>
        <TagsDisplay tags={user && user.user_technologies} />
      </div>
    );
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
        <div key={i}>
          <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">
            {this._legibleFileName(file)}
          </a>
        </div>
      ))
    );
  }

  _renderEditUserButton(): React$Node {
    return (
      <div className="about-user-section">
        <Button
          variant="primary"
          type="button"
          href={url.section(Section.EditProfile)}
        >
          Edit Profile
        </Button>
      </div>
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
      </React.Fragment>
    );
  }

  _legibleFileName(input: FileInfo) {
    //replaces specific file names for readability
    return FileCategoryNames[input.fileCategory] || input.fileName;
  }
}

export default AboutUserController;
