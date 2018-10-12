// @flow

import React from 'react';
import TagsDisplay from '../common/tags/TagsDisplay.jsx'
import {LinkNames} from "../constants/LinkConstants.js";
import {FileCategoryNames} from "../constants/FileConstants.js";
import {UserAPIData} from "../utils/UserAPIUtils.js";
import UserAPIUtils from "../utils/UserAPIUtils.js";
import {FileInfo} from "../common/FileInfo.jsx";
import _ from 'lodash'

type State = {|
  user: ?UserAPIData,
|};

class AboutUserController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();

    this.state = {
      user: null
    };
  }

  componentDidMount() {
    var userId = (new RegExp("id=([^&]+)")).exec(document.location.search)[1];
    UserAPIUtils.fetchUserDetails(userId, this.loadUserDetails.bind(this));
  }

  loadUserDetails(user: UserAPIData) {
    this.setState({
      user: user
    });
  }

  render(): React$Node {
    return this.state.user ? this._renderDetails() : <div>Loading...</div>
  }

  _renderDetails(): React$Node {
    const user: UserAPIData = this.state.user;
    return (
      <div className="AboutProjectController-root">
        <div className="container-fluid">
          <div className="background-light">
            <div className="row" style={{margin: "30px 0 0 0", padding: "10px 0"}}>
              <div className="col-sm-5">
                <div className="row">
                  <div className="col-sm-auto">
                    <img className="upload_img upload_img_bdr" src={user && user.user_thumbnail && user.user_thumbnail.publicUrl} />
                  </div>
                  <div className="col">
                    <div className="row">
                      <div className="col">
                        {user && user.first_name + " " + user.last_name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
              </div>
              <div className="col col-sm-3">
              </div>
            </div>
          </div>

          {
            user && !_.isEmpty(user.user_technologies)
              ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
                  <div className='col'>
                    <h2 className="form-group subheader">TECHNOLOGIES</h2>
                    <div className="Text-section">
                      {this._renderTechnologies()}
                    </div>
                  </div>
                </div>
              : null
          }

          <div className="row" style={{margin: "30px 40px 0 40px"}}>
            <div className="col">
              <h2 className="form-group subheader">ABOUT ME</h2>
              <div className="Text-section" style={{whiteSpace: "pre-wrap"}}>
                {user && user.about_me}
              </div>
            </div>
          </div>

          {
            user && !_.isEmpty(user.user_links)
              ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
                  <div className='col'>
                    <h2 className="form-group subheader">LINKS</h2>
                    <div className="Text-section">
                      {this._renderLinks()}
                    </div>
                  </div>
                </div>
              : null
          }

          {
            user && !_.isEmpty(user.user_files)
              ? <div className="row" style={{margin: "30px 40px 0 40px"}}>
                  <div className='col'>
                    <h2 className="form-group subheader">FILES</h2>
                    <div className="Text-section">
                      {this._renderFiles()}
                    </div>
                  </div>
                </div>
              : null
          }
        </div>
      </div>
    );
  }

  _renderTechnologies(): ?Array<React$Node> {
    const user: UserAPIData = this.state.user;
    return user && user.user_technologies &&
      <TagsDisplay tags={user && user.user_technologies}/>
  }


  _renderLinks(): ?Array<React$Node> {
    const user: UserAPIData = this.state.user;
    return user && user.user_links && user.user_links.map((link, i) =>
      <div key={i}>
        <a href={link.linkUrl} target="_blank" rel="noopener noreferrer">{this._legibleLinkName(link.linkName)}</a>
      </div>
    );
  }

  _renderFiles(): ?Array<React$Node> {
    const user = this.state.user;
    return user && user.user_files && user.user_files.map((file, i) =>
      <div key={i}>
        <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">{this._legibleFileName(file)}</a>
      </div>
    );
  }

  _legibleLinkName(input) {
    //replaces specific linkNames for readability
    return LinkNames[input] || input;
  }

  _legibleFileName(input: FileInfo) {
    //replaces specific file names for readability
    return FileCategoryNames[input.fileCategory] || input.fileName;
  }
}

export default AboutUserController;
