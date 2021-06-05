// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import { LinkInfo } from "../../forms/LinkInfo.jsx";
import Visibility from "../../common/Visibility.jsx";
import type { FileInfo } from "../../common/FileInfo.jsx";
import LinkList, { linkCaptions, NewLinkInfo } from "../../forms/LinkList.jsx";
import {
  createDictionary,
  Dictionary,
  PartitionSet,
} from "../../types/Generics.jsx";
import FileUploadList from "../../forms/FileUploadList.jsx";
import formHelper, { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import FormValidation from "../../forms/FormValidation.jsx";
import type { Validator } from "../../forms/FormValidation.jsx";
import { OnReadySubmitFunc } from "./ProjectFormCommon.jsx";
import {
  DefaultLinkDisplayConfigurations,
  LinkTypes,
} from "../../constants/LinkConstants.js";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import url from "../../utils/url.js";
import stringHelper from "../../utils/string.js";
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
  linkDict: Dictionary<NewLinkInfo>,
  resourceLinkDict: Dictionary<NewLinkInfo>,
  socialLinkDict: Dictionary<NewLinkInfo>,
  validations: $ReadOnlyArray<Validator>,
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
class ProjectResourcesForm extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    const formFields: FormFields = {
      project_links: project ? project.project_links : [],
      project_files: project ? project.project_files : [],
    };
    const linkDictsState: state = this.generateLinkDicts(props, formFields);
    const formIsValid: boolean = FormValidation.isValid(
      formFields,
      linkDictsState.validations
    );
    this.state = Object.assign(
      {
        formFields: formFields,
        formIsValid: formIsValid,
      },
      linkDictsState
    );
    //this will set formFields.project_links and formFields.links_*
    this.filterSpecificLinks(_.cloneDeep(project.project_links));
    this.form = formHelper.setup();
    props.readyForSubmit(formIsValid, this.onSubmit.bind(this));
  }

  componentDidMount() {
    this.form.doValidation.bind(this)();
  }

  generateBlankLink(linkName: string): NewLinkInfo {
    const link: NewLinkInfo = {
      tempId: stringHelper.randomAlphanumeric(),
      linkName: linkName,
      linkUrl: "",
      visibility: Visibility.PUBLIC,
    };
    return link;
  }

  generateLinkKey(link: NewLinkInfo): string {
    if (_.includes(allPresetLinks, link.linkName)) {
      return link.linkName;
    } else {
      const id: string = link.tempId || link.id;
      return link.linkName + id;
    }
  }

  generateLinkDicts(props: Props, formFields: FormFields): State {
    // Generate blank links for presets
    let linkDict: Dictionary<NewLinkInfo> = createDictionary(
      allPresetLinks,
      (key: string) => key,
      (key: string) => this.generateBlankLink(key)
    );
    // Merge in existing links
    linkDict = Object.assign(
      linkDict,
      _.mapKeys(props.project.project_links, this.generateLinkKey)
    );
    return this.updateLinkDicts(formFields, linkDict);
  }

  updateLinkDicts(
    formFields: FormFields,
    linkDict: Dictionary<NewLinkInfo>
  ): State {
    // Split keys into resource and social links
    const allKeys: $ReadOnlyArray<string> = _.keys(linkDict);
    const socialResourceLinks: PartitionSet<string> = _.partition(
      allKeys,
      (key: string) =>
        _.startsWith(key, "social_") || key === LinkTypes.LINKED_IN
    );
    const validations: $ReadOnlyArray<Validator<FormFields>> = allKeys.map(
      (key: string) => {
        const fieldName: string =
          key in linkCaptions ? linkCaptions[key] : linkDict[key].linkName;
        return {
          checkFunc: (formFields: FormFields) =>
            url.isEmptyStringOrValidUrl(formFields[key]),
          errorMessage: "Please enter valid URL for " + fieldName,
        };
      }
    );

    const formIsValid: boolean = FormValidation.isValid(
      formFields,
      validations
    );

    return {
      linkDict: linkDict,
      socialLinkDict: _.pick(linkDict, socialResourceLinks[0]),
      resourceLinkDict: _.pick(linkDict, socialResourceLinks[1]),
      formFields: formFields,
      formIsValid: formIsValid,
      validations: validations,
    };
  }

  onValidationCheck(formIsValid: boolean): void {
    if (formIsValid !== this.state.formIsValid) {
      this.setState({ formIsValid });
      this.props.readyForSubmit(formIsValid, this.onSubmit.bind(this));
    }
  }

  onSubmit(submitFunc: Function): void {
    let formFields = this.state.formFields;
    formFields.project_links = _.values(this.state.linkDict).filter(
      (link: LinkInfo) => !_.isEmpty(link.linkUrl)
    );
    formFields.project_links.forEach((link: NewLinkInfo) => {
      link.linkUrl = url.appendHttpIfMissingProtocol(link.linkUrl);
    });
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
    linkState["project_links"] = array;

    //TODO: see if there's a way to do this without the forceUpdate - passing by reference problem?
    this.setState({ formFields: linkState });
    this.forceUpdate();
  }

  onAddLink(link: NewLinkInfo): void {
    const key: string = this.generateLinkKey(link);
    const linkDict: Dictionary<NewLinkInfo> = _.clone(this.state.linkDict);
    linkDict[key] = link;
    const state: state = this.updateLinkDicts(this.state.formFields, linkDict);
    this.setState(state);
  }

  onChangeLink(
    linkKey: string,
    input: SyntheticInputEvent<HTMLInputElement>
  ): void {
    this.state.linkDict[linkKey].linkUrl = input.target.value;
    this.form.onInput.call(this, linkKey, input);
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
            linkDict={this.state.resourceLinkDict}
            linkOrdering={resourceLinks}
            addLinkText="Add a new link"
            onAddLink={this.onAddLink.bind(this)}
            onChangeLink={this.onChangeLink.bind(this)}
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
            onAddLink={this.onAddLink.bind(this)}
            onChangeLink={this.onChangeLink.bind(this)}
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
          validations={this.state.validations}
          onValidationCheck={this.onValidationCheck.bind(this)}
          formState={this.state.formFields}
        />
      </div>
    );
  }
}

export default ProjectResourcesForm;
