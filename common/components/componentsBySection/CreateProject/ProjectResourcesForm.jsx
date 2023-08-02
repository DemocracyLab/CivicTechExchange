// @flow

import React from "react";
import { Container } from "flux/utils";
import DjangoCSRFToken from "django-react-csrftoken";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import { LinkInfo } from "../../forms/LinkInfo.jsx";
import type { FileInfo } from "../../common/FileInfo.jsx";
import LinkList, {
  compileLinkFormFields,
  linkCaptions,
} from "../../forms/LinkList.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { Dictionary } from "../../types/Generics.jsx";
import FileUploadList from "../../forms/FileUploadList.jsx";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import { OnReadySubmitFunc } from "./ProjectFormCommon.jsx";
import { LinkTypes } from "../../constants/LinkConstants.js";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import _ from "lodash";
import FormFieldsStore from "../../stores/FormFieldsStore.js";

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
  formFields: Dictionary<any>,
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
    };

    UniversalDispatcher.dispatch({
      type: "SET_FORM_FIELDS",
      formFieldValues: formFields,
      validators: [],
    });
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.formFields = _.clone(FormFieldsStore.getFormFieldValues());
    return state;
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <HiddenFormFields
          sourceDict={{
            project_links:
              this.state.formFields &&
              JSON.stringify(
                compileLinkFormFields(
                  this.state.formFields.project_links,
                  _.omit(this.state.formFields, [
                    "project_files",
                    "project_links",
                  ])
                ) || []
              ),
          }}
        />

        <div className="form-group create-form-block">
          <LinkList
            title="Project Resources"
            subheader="Paste the links to your internal collaboration tools"
            linkNamePrefixExclude={["social_", LinkTypes.LINKED_IN]}
            linkOrdering={resourceLinks}
            addLinkText="Add a new link"
            links={this.props.project.project_links}
          />
        </div>

        <div className="form-group create-form-block">
          <LinkList
            title="Social Media"
            subheader="Paste the links to your social media profiles"
            linkNamePrefix="social_"
            linkOrdering={socialLinks}
            addLinkText="Add a social link"
            links={this.props.project.project_links}
          />
        </div>

        <div className="form-group create-form-block">
          <FileUploadList
            elementid="project_files"
            title="Project Files"
            subheader="Add files or documents"
            files={this.state.formFields.project_files}
          />
        </div>
      </div>
    );
  }
}

export default Container.create(ProjectResourcesForm, { withProps: true });
