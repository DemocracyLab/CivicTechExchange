// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import type {ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import type {LinkInfo} from "../../forms/LinkInfo.jsx";
import type {FileInfo} from "../../common/FileInfo.jsx";
import LinkList from "../../forms/LinkList.jsx";
import FileUploadList from "../../forms/FileUploadList.jsx";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import {OnReadySubmitFunc} from "./EventFormCommon.jsx";
import {DefaultLinkDisplayConfigurations} from "../../constants/LinkConstants.js";
import url from "../../utils/url.js";
import _ from "lodash";


type FormFields = {|
  project_links: Array<LinkInfo>,
  project_files: Array<FileInfo>,
  link_coderepo: ?string,
  link_messaging: ?string,
  link_projmanage: ?string,
  link_filerepo: ?string
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc
|} & FormPropsBase<FormFields>;

type State = FormStateBase<FormFields>;

/**
 * Encapsulates form for Project Resources section
 */
class ProjectResourcesForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    this.state = {
      formIsValid: false,
      formFields: {
        project_links: project ? project.project_links : [],
        project_files: project ? project.project_files : [],
        link_coderepo: project ? project.link_coderepo : "",
        link_messaging: project ? project.link_messaging : "",
        link_projmanage: project ? project.link_projmanage : "",
        link_filerepo: project ? project.link_filerepo : ""
      }
    };
    
    //this will set formFields.project_links and formFields.links_*
    this.filterSpecificLinks(_.cloneDeep(project.project_links));
    this.form = form.setup();
    props.readyForSubmit(true, this.onSubmit.bind(this));
  }
  
  // TODO: Put common code used between EditProjectsForm in a common place
  onSubmit(submitFunc: Function): void {
    //Sanitize project url if necessary
    if(this.state.formFields.project_url) {
      this.state.formFields.project_url = url.appendHttpIfMissingProtocol(this.state.formFields.project_url);
    }
    // create input array
    let eLinks = ['link_coderepo','link_messaging','link_filerepo','link_projmanage'].map(name => ({linkName: name, linkUrl: this.state.formFields[name]}));
    //create output array
    let eLinksArray = [];
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
    formFields.project_links = formFields.project_links.concat(eLinksArray);
    this.setState({ formFields: formFields}, submitFunc);
    this.forceUpdate();
  }
  
  filterSpecificLinks(array) {
    //this function updates the entire state.formFields object at once
    let specificLinks = _.remove(array, function(n) {
      return n.linkName in DefaultLinkDisplayConfigurations;
    });
    //copy the formFields state to work with
    let linkState = this.state.formFields;
    //pull out the link_ item key:values and append to state copy
    specificLinks.forEach(function(item) {
      linkState[item.linkName] = item.linkUrl;
    });
    //add the other links to state copy
    linkState['project_links'] = array;
    
    //TODO: see if there's a way to do this without the forceUpdate - passing by reference problem?
    this.setState({ formFields: linkState });
    this.forceUpdate();
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">

        <DjangoCSRFToken/>
  
        <div className="form-group">
          <label htmlFor="link_coderepo">Code Repository <span className="label-hint">(e.g. Github)</span></label>
          <input type="text" className="form-control" id="link_coderepo" name="link_coderepo" maxLength="2075"
                 value={this.state.formFields.link_coderepo} onChange={this.form.onInput.bind(this, "link_coderepo")}/>
        </div>
  
        <div className="form-group">
          <label htmlFor="link_messaging">Messaging <span className="label-hint">(e.g. Slack)</span></label>
          <input type="text" className="form-control" id="link_messaging" name="link_messaging" maxLength="2075"
                 value={this.state.formFields.link_messaging} onChange={this.form.onInput.bind(this, "link_messaging")}/>
        </div>
  
        <div className="form-group">
          <label htmlFor="link_projmanage">Project Management <span className="label-hint">(e.g. Trello)</span></label>
          <input type="text" className="form-control" id="link_projmanage" name="link_projmanage" maxLength="2075"
                 value={this.state.formFields.link_projmanage} onChange={this.form.onInput.bind(this, "link_projmanage")}/>
        </div>
  
        <div className="form-group">
          <label htmlFor="link_filerepo">File Repository <span className="label-hint">(e.g. Google Drive)</span></label>
          <input type="text" className="form-control" id="link_filerepo" name="link_filerepo" maxLength="2075"
                 value={this.state.formFields.link_filerepo} onChange={this.form.onInput.bind(this, "link_filerepo")}/>
        </div>
  
        <div className="form-group">
          <LinkList elementid="project_links" title="Project Links" links={this.state.formFields.project_links}/>
        </div>
  
        <div className="form-group">
          <FileUploadList elementid="project_files" title="Project Files" files={this.state.formFields.project_files}/>
        </div>

      </div>
    );
  }
}

export default ProjectResourcesForm;