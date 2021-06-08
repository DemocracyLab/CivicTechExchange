// @flow

import React from "react";
import { Container } from "flux/utils";
import DjangoCSRFToken from "django-react-csrftoken";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import { LinkInfo } from "../../forms/LinkInfo.jsx";
import type { FileInfo } from "../../common/FileInfo.jsx";
import LinkList, { linkCaptions } from "../../forms/LinkList.jsx";
import LinkListStore, { NewLinkInfo } from "../../stores/LinkListStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { Dictionary } from "../../types/Generics.jsx";
import FileUploadList from "../../forms/FileUploadList.jsx";
import formHelper, { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import FormValidation from "../../forms/FormValidation.jsx";
import { OnReadySubmitFunc } from "./ProjectFormCommon.jsx";
import { LinkTypes } from "../../constants/LinkConstants.js";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import url from "../../utils/url.js";
import _ from "lodash";

type FormFields = {|
  project_links: Array<LinkInfo>,
  project_files: Array<FileInfo>,
|} & Dictionary<string>;

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc,
|} & FormPropsBase<FormFields>;

type State = {|
  errorMessages: $ReadOnlyArray<string>,
|} & FormStateBase<FormFields>;

const resourceLinks: $ReadOnlyArray<string> = [
  LinkTypes.CODE_REPOSITORY,
  LinkTypes.MESSAGING,
  LinkTypes.PROJECT_MANAGEMENT,
  LinkTypes.FILE_REPOSITORY,
  LinkTypes.DESIGN,
];

const socialLinks: $ReadOnlyArray<string> = [
  LinkTypes.TWITTER,
  LinkTypes.FACEBOOK,
  LinkTypes.LINKED_IN,
];

const allPresetLinks: $ReadOnlyArray<string> = _.concat(
  resourceLinks,
  socialLinks
);

/**
 * Encapsulates form for Project Resources section
 */
class ProjectResourcesForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    const formFields: FormFields = {
      project_links: project ? project.project_links : [],
      project_files: project ? project.project_files : [],
    };
    this.state = {
      formFields: formFields,
      onSubmit: this.onSubmit.bind(this),
    };
    this.form = formHelper.setup();
    UniversalDispatcher.dispatch({
      type: "SET_LINK_LIST",
      links: project.project_links,
      presetLinks: allPresetLinks,
    });
    props.readyForSubmit(true, this.state.onSubmit);
  }

  componentDidMount() {
    this.form.doValidation.bind(this)();
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [LinkListStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || { formFields: {} };
    state.formFields.project_links = LinkListStore.getLinkList();
    state.errorMessages = LinkListStore.getLinkErrors();
    state.formIsValid = _.isEmpty(state.errorMessages);
    props.readyForSubmit(state.formIsValid, state.onSubmit);
    return state;
  }

  onValidationCheck(formIsValid: boolean): void {
    if (formIsValid !== this.state.formIsValid) {
      this.setState({ formIsValid });
      this.props.readyForSubmit(formIsValid, this.onSubmit.bind(this));
    }
  }

  onSubmit(submitFunc: Function): void {
    let formFields = this.state.formFields;
    let project_links: $ReadOnlyArray<NewLinkInfo> = LinkListStore.getLinkList();
    formFields.project_links = project_links.filter(
      (link: LinkInfo) => !_.isEmpty(link.linkUrl)
    );
    formFields.project_links.forEach((link: NewLinkInfo) => {
      link.linkUrl = url.appendHttpIfMissingProtocol(link.linkUrl);
    });
    this.setState({ formFields: formFields }, submitFunc);
    this.forceUpdate();
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <HiddenFormFields
          sourceDict={{
            project_links: JSON.stringify(
              this.state.formFields.project_links || []
            ),
          }}
        />

        <div className="form-group create-form-block">
          <LinkList
            elementid="resource_links"
            title="Project Resources"
            subheader="Paste the links to your internal collaboration tools"
            linkNamePrefixExclude={["social_", LinkTypes.LINKED_IN]}
            linkDict={this.state.resourceLinkDict}
            linkOrdering={resourceLinks}
            addLinkText="Add a new link"
          />
        </div>

        <div className="form-group create-form-block">
          <LinkList
            elementid="social_links"
            title="Social Media"
            subheader="Paste the links to your social media profiles"
            linkNamePrefix="social_"
            linkDict={this.state.socialLinkDict}
            linkOrdering={socialLinks}
            addLinkText="Add a social link"
          />
        </div>

        <div className="form-group create-form-block">
          <FileUploadList
            elementid="project_files"
            title="Project Files"
            subheader="Add the files or documents"
            files={this.state.formFields.project_files}
            onChange={this.form.onFormChange.bind(this)}
          />
        </div>

        <FormValidation
          onValidationCheck={this.onValidationCheck.bind(this)}
          formState={this.state.formFields}
          errorMessages={this.state.errorMessages}
        />
      </div>
    );
  }
}

export default Container.create(ProjectResourcesForm, { withProps: true });
