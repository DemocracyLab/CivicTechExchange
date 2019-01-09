// @flow

import React from 'react'
import DjangoCSRFToken from 'django-react-csrftoken'
import UserAPIUtils from "../utils/UserAPIUtils.js";
import type {UserAPIData} from "../utils/UserAPIUtils.js";
import {CountrySelector, defaultCountryCode} from "../common/selection/CountrySelector.jsx";
import TagCategory from "../common/tags/TagCategory.jsx";
import TagSelector from "../common/tags/TagSelector.jsx";
import LinkList from "../forms/LinkList.jsx";
import {LinkInfo} from "../forms/LinkInfo.jsx";
import {FileInfo} from "../common/FileInfo.jsx";
import ImageUploadFormElement from "../forms/ImageUploadFormElement.jsx";
import FileUploadList from "../forms/FileUploadList.jsx";
import url from "../utils/url.js";
import metrics from "../utils/metrics.js";
import CurrentUser from "../utils/CurrentUser.js";
import _ from 'lodash';

const UserLinkNames = ['link_linkedin'];

const UserFileTypes = {
  RESUME: "RESUME"
};

type FormFields = {|
  +user_thumbnail?: FileInfo,
  +first_name: string,
  +last_name: string,
  +about_me: string,
  +link_linkedin: string,
  +user_resume_file: Array<FileInfo>,
  +technologies_used: Array<TagDefinition>,
  +postal_code: string,
  +country: string,
  +user_links: Array<LinkInfo>,
  +user_files: Array<FileInfo>
|};

type State = {|
  formFields: number
|};

/**
 * Encapsulates form for editing projects
 */
class EditProfileController extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
    this.state = {
      formFields: {
        user_thumbnail: "",
        first_name: "",
        last_name: "",
        about_me: "",
        link_linkedin: "",
        user_technologies: [],
        postal_code: "",
        country: defaultCountryCode,
        user_links: [],
        user_files: []
      }
    }
  }
  
  componentDidMount(): void {
    // TODO: Show error message on failure to load
    UserAPIUtils.fetchUserDetails(window.DLAB_GLOBAL_CONTEXT.userID, this.loadUserDetails.bind(this));
  }
  
  loadUserDetails(user: UserAPIData): void {
    this.setState({
      formFields: {
        first_name: user.first_name,
        last_name: user.last_name,
        about_me: user.about_me,
        user_links: user.user_links,
        postal_code: user.postal_code,
        country: user.country || defaultCountryCode,
        user_technologies: user.user_technologies,
        user_resume_file: user.user_files.filter((file: FileInfo) => file.fileCategory === UserFileTypes.RESUME),
        user_files: user.user_files.filter((file: FileInfo) => file.fileCategory !== UserFileTypes.RESUME),
        user_thumbnail: user.user_thumbnail
      }
    });
  
    //this will set formFields.user_links and formFields.links_*
    this.filterSpecificLinks(user.user_links);
    metrics.logUserProfileEditEntry(CurrentUser.userID());
  }
  
  onFormFieldChange(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
  }
  
  onTagChange(formFieldName: string, value: string): void {
    this.state.formFields[formFieldName] = value;
  }
  
  handleCountrySelection(selectedValue: string): void {
    let formFields: FormFields = this.state.formFields;
    formFields.country = selectedValue;
    this.setState({formFields: formFields}, function() {
      this.forceUpdate();
    });
  }
  
  onSubmit(): void {
    // create input array
    var eLinks = UserLinkNames.map(name => ({linkName: name, linkUrl: this.state.formFields[name]}))
    //create output array
    var eLinksArray = [];
    //create objects for project_links array, skipping empty fields
    eLinks.forEach(function(item) {
      if(!_.isEmpty(item.linkUrl)) {
        item.linkUrl = url.appendHttpIfMissingProtocol(item.linkUrl);
        eLinksArray.push({
          linkName: item.linkName,
          linkUrl: item.linkUrl,
          visibility: "PUBLIC",
        })
      }
    });
    //combine arrays prior to sending to backend
    let formFields = this.state.formFields;
    formFields.user_links = formFields.user_links.concat(eLinksArray);
    this.setState({ formFields: formFields});
    this.forceUpdate();
    metrics.logUserProfileEditSave(CurrentUser.userID());
  }
  
  filterSpecificLinks(array) {
    //this function updates the entire state.formFields object at once
    var specificLinks = _.remove(array, function(n) {
      return _.includes(UserLinkNames, n.linkName);
    });
    //copy the formFields state to work with
    var linkState = this.state.formFields;
    //pull out the link_ item key:values and append to state copy
    specificLinks.forEach(function(item) {
      linkState[item.linkName] = item.linkUrl;
    });
    //add the other links to state copy
    linkState['user_links'] = array;
    
    //TODO: see if there's a way to do this without the forceUpdate - passing by reference problem?
    this.setState({ formFields: linkState });
    this.forceUpdate();
  }
  
  render(): React$Node {
    return (
      <div className="wrapper-gray">
        <div className="container">
          <form action={`/api/user/edit/${window.DLAB_GLOBAL_CONTEXT.userID}/`} method="post">
            <div className="EditProjectForm-root">
              <DjangoCSRFToken/>
  
              <div className="form-group">
                <ImageUploadFormElement form_id="user_thumbnail_location"
                                        buttonText="Upload Your Picture"
                                        currentImage={this.state.formFields.user_thumbnail}/>
              </div>
              
              <div className="form-group">
                <label>
                  ABOUT ME
                </label>
                <div className="character-count">
                  { (this.state.formFields.about_me || "").length} / 2000
                </div>
                <textarea className="form-control" id="about_me" name="about_me" rows="6" maxLength="2000"
                          value={this.state.formFields.about_me} onChange={this.onFormFieldChange.bind(this, "about_me")}/>
              </div>
              
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" id="first_name" name="first_name" maxLength="30"
                       value={this.state.formFields.first_name} onChange={this.onFormFieldChange.bind(this, "first_name")}/>
              </div>
  
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" id="last_name" name="last_name" maxLength="30"
                       value={this.state.formFields.last_name} onChange={this.onFormFieldChange.bind(this, "last_name")}/>
              </div>
  
              <div className="form-group">
                <label htmlFor="link_linkedin">LinkedIn</label>
                <input type="text" className="form-control" id="link_linkedin" name="link_linkedin" maxLength="2075"
                       value={this.state.formFields.link_linkedin} onChange={this.onFormFieldChange.bind(this, "link_linkedin")}/>
              </div>
  
              <div className="form-group">
                <FileUploadList
                  elementid="user_resume_file"
                  title="Upload Resume"
                  singleFileOnly={true}
                  files={this.state.formFields.user_resume_file}/>
              </div>
  
              <div className="form-group">
                <label>Technologies Used</label>
                <TagSelector
                  elementId="user_technologies"
                  value={this.state.formFields.user_technologies}
                  category={TagCategory.TECHNOLOGIES_USED}
                  allowMultiSelect={true}
                  onSelection={this.onTagChange.bind(this, "user_technologies")}
                />
              </div>
  
              <div className="form-group">
                <label>Country</label>
                <CountrySelector
                  countryCode={this.state.formFields.country}
                  onSelection={this.handleCountrySelection.bind(this)}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="postal_code">Zip/Postal Code</label>
                <input type="text" className="form-control" id="postal_code" name="postal_code" maxLength="10"
                       value={this.state.formFields.postal_code} onChange={this.onFormFieldChange.bind(this, "postal_code")}/>
              </div>
  
              <div className="form-group">
                <LinkList elementid="user_links"
                          title="Links"
                          hiddenLinkNames={["link_linkedin"]}
                          links={this.state.formFields.user_links}/>
              </div>
  
              <div className="form-group">
                <FileUploadList elementid="user_files" title="Files" files={this.state.formFields.user_files}/>
              </div>
  
              <div className="form-group pull-right">
                <div className='text-right'>
                  <input type="submit" className="btn_outline save_btn"
                         value="Save Changes" onClick={this.onSubmit.bind(this)}/>
                </div>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  
}

export default EditProfileController;
