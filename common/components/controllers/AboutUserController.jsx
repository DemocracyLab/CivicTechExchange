// @flow

import React from "react";
import TagsDisplay from "../common/tags/TagsDisplay.jsx";
import { DefaultLinkDisplayConfigurations } from "../constants/LinkConstants.js";
import { FileCategoryNames } from "../constants/FileConstants.js";
import { UserAPIData } from "../utils/UserAPIUtils.js";
import UserAPIUtils from "../utils/UserAPIUtils.js";
import { FileInfo } from "../common/FileInfo.jsx";
import { LinkInfo } from "../forms/LinkInfo.jsx";
import Avatar from "../common/avatar.jsx";
import _ from "lodash";
import LoadingMessage from "../chrome/LoadingMessage.jsx";
import url from "../utils/url.js";

type State = {|
  user: ?UserAPIData,
|};

class AboutUserController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();

    this.state = {
      user: null,
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

  _renderDetails(): React$Node {
    const user: UserAPIData = this.state.user;
    return (
      <React.Fragment>
        <div className="AboutProjectController-root">
          <div className="container">
            <div className="row background-light about-user-section">
              <div className="col">
                <Avatar user={user} size={50} />
                <h1 className="about-user-name">
                  {user && user.first_name + " " + user.last_name}
                </h1>
              </div>
            </div>

            {user && !_.isEmpty(user.user_technologies) ? (
              <div className="row about-user-section">
                <div className="col">
                  <h2 className="subheader">TECHNOLOGIES</h2>
                  <div className="Text-section">
                    {this._renderTechnologies()}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="row about-user-section">
              <div className="col">
                <h2 className="subheader">ABOUT ME</h2>
                <div
                  className="Text-section"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {user && user.about_me}
                </div>
              </div>
            </div>

            {user && !_.isEmpty(user.user_links) ? (
              <div className="row about-user-section">
                <div className="col">
                  <h2 className="subheader">LINKS</h2>
                  <div className="Text-section">{this._renderLinks()}</div>
                </div>
              </div>
            ) : null}

            {user && !_.isEmpty(user.user_files) ? (
              <div className="row about-user-section">
                <div className="col">
                  <h2 className="subheader">FILES</h2>
                  <div className="Text-section">{this._renderFiles()}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderTechnologies(): ?Array<React$Node> {
    const user: UserAPIData = this.state.user;
    return (
      user &&
      user.user_technologies && (
        <TagsDisplay tags={user && user.user_technologies} />
      )
    );
  }

  _renderLinks(): ?Array<React$Node> {
    const user: UserAPIData = this.state.user;
    return (
      user &&
      user.user_links &&
      user.user_links.map((link, i) => (
        <div key={i}>
          <a href={link.linkUrl} target="_blank" rel="noopener noreferrer">
            {this._legibleLinkName(link)}
          </a>
        </div>
      ))
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

  _legibleLinkName(link: LinkInfo) {
    //replaces specific link Names for readability
    return link.linkName in DefaultLinkDisplayConfigurations
      ? DefaultLinkDisplayConfigurations[link.linkName].sourceTypeDisplayName
      : link.linkName || link.linkUrl;
  }

  _legibleFileName(input: FileInfo) {
    //replaces specific file names for readability
    return FileCategoryNames[input.fileCategory] || input.fileName;
  }
}

export default AboutUserController;
