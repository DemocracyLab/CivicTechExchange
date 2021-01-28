// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import type { GroupDetailsAPIData } from "../../../components/utils/GroupAPIUtils.js";
import type { LinkInfo } from "../../forms/LinkInfo.jsx";
import type { FileInfo } from "../../common/FileInfo.jsx";
import LinkList from "../../forms/LinkList.jsx";
import form, { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import FormValidation, { Validator } from "../../forms/FormValidation.jsx";
import { OnReadySubmitFunc } from "./GroupFormCommon.jsx";
import { DefaultLinkDisplayConfigurations } from "../../constants/LinkConstants.js";
import url from "../../utils/url.js";
import _ from "lodash";

type FormFields = {|
  group_links: Array<LinkInfo>,
  group_files: Array<FileInfo>,
  link_coderepo: ?string,
  link_messaging: ?string,
  link_projmanage: ?string,
  link_filerepo: ?string,
|};

type Props = {|
  group: ?GroupDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc,
|} & FormPropsBase<FormFields>;

type State = FormStateBase<FormFields>;

/**
 * Encapsulates form for Group Resources section
 */
class GroupResourcesForm extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const group: GroupDetailsAPIData = props.project; // TODO(jj): forms are hardcoded to provide the value as 'project' (i.e. not configurable, FormWorkflow.jsx:169)

    const formFields: FormFields = {
      group_url: group && group.group_url,
      group_links: group ? group.group_links : [],
      group_files: group ? group.group_files : [],
      link_coderepo: group ? group.link_coderepo : "",
      link_messaging: group ? group.link_messaging : "",
      link_projmanage: group ? group.link_projmanage : "",
      link_filerepo: group ? group.link_filerepo : "",
    };

    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) =>
          url.isEmptyStringOrValidUrl(formFields["group_url"]),
        errorMessage: "Please enter valid Website URL.",
      },
      {
        checkFunc: (formFields: FormFields) =>
          url.isEmptyStringOrValidUrl(formFields["link_coderepo"]),
        errorMessage: "Please enter valid URL for code repository website.",
      },
      {
        checkFunc: (formFields: FormFields) =>
          url.isEmptyStringOrValidUrl(formFields["link_messaging"]),
        errorMessage: "Please enter valid URL for messaging website.",
      },
      {
        checkFunc: (formFields: FormFields) =>
          url.isEmptyStringOrValidUrl(formFields["link_projmanage"]),
        errorMessage: "Please enter valid URL for project management website.",
      },
      {
        checkFunc: (formFields: FormFields) =>
          url.isEmptyStringOrValidUrl(formFields["link_filerepo"]),
        errorMessage: "Please enter valid URL for file repository website.",
      },
    ];
    const formIsValid: boolean = FormValidation.isValid(
      formFields,
      validations
    );
    this.state = {
      formFields: formFields,
      formIsValid: formIsValid,
      validations: validations,
    };

    //this will set formFields.group_links and formFields.links_*
    this.filterSpecificLinks(_.cloneDeep(group.group_links));
    this.form = form.setup();
    props.readyForSubmit(true, this.onSubmit.bind(this));
  }

  onValidationCheck(formIsValid: boolean): void {
    if (formIsValid !== this.state.formIsValid) {
      this.setState({ formIsValid });
      this.props.readyForSubmit(formIsValid, this.onSubmit.bind(this));
    }
  }

  // TODO: Put common code used between EditGroupsForm in a common place
  onSubmit(submitFunc: Function): void {
    //Sanitize group url if necessary
    if (this.state.formFields.group_url) {
      this.state.formFields.group_url = url.appendHttpIfMissingProtocol(
        this.state.formFields.group_url
      );
    }
    // create input array
    let eLinks = [
      "link_coderepo",
      "link_messaging",
      "link_filerepo",
      "link_projmanage",
    ].map(name => ({ linkName: name, linkUrl: this.state.formFields[name] }));
    //create output array
    let eLinksArray = [];
    //create objects for group_links array, skipping empty fields
    eLinks.forEach(function(item) {
      if (!_.isEmpty(item.linkUrl)) {
        item.linkUrl = url.appendHttpIfMissingProtocol(item.linkUrl);
        eLinksArray.push({
          linkName: item.linkName,
          linkUrl: item.linkUrl,
          visibility: "PUBLIC",
        });
      }
    });
    //combine arrays prior to sending to backend
    let formFields = this.state.formFields;
    formFields.group_links = formFields.group_links.concat(eLinksArray);
    this.setState({ formFields: formFields }, submitFunc);
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
    linkState["group_links"] = array;

    //TODO: see if there's a way to do this without the forceUpdate - passing by reference problem?
    this.setState({ formFields: linkState });
    this.forceUpdate();
  }

  render(): React$Node {
    return (
      <div className="EditGroupForm-root">
        <DjangoCSRFToken />

        <div className="form-group">
          <label htmlFor="group_url">Website URL</label>
          <input
            type="text"
            className="form-control"
            id="group_url"
            name="group_url"
            maxLength="2075"
            value={this.state.formFields.group_url}
            onChange={this.form.onInput.bind(this, "group_url")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="link_coderepo">
            Code Repository <span className="label-hint">(e.g. Github)</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="link_coderepo"
            name="link_coderepo"
            maxLength="2075"
            value={this.state.formFields.link_coderepo}
            onChange={this.form.onInput.bind(this, "link_coderepo")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="link_messaging">
            Messaging <span className="label-hint">(e.g. Slack)</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="link_messaging"
            name="link_messaging"
            maxLength="2075"
            value={this.state.formFields.link_messaging}
            onChange={this.form.onInput.bind(this, "link_messaging")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="link_projmanage">
            Group Management <span className="label-hint">(e.g. Trello)</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="link_projmanage"
            name="link_projmanage"
            maxLength="2075"
            value={this.state.formFields.link_projmanage}
            onChange={this.form.onInput.bind(this, "link_projmanage")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="link_filerepo">
            File Repository{" "}
            <span className="label-hint">(e.g. Google Drive)</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="link_filerepo"
            name="link_filerepo"
            maxLength="2075"
            value={this.state.formFields.link_filerepo}
            onChange={this.form.onInput.bind(this, "link_filerepo")}
          />
        </div>

        <div className="form-group">
          <LinkList
            elementid="group_links"
            title="Group Links"
            links={this.state.formFields.group_links}
          />
        </div>

        <FormValidation
          validations={this.state.validations}
          onValidationCheck={this.onValidationCheck.bind(this)}
          formState={this.state.formFields}
        />
      </div>
    );
  }
}

export default GroupResourcesForm;
