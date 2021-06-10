// @flow

import React from "react";
import { Container } from "flux/utils";
import DjangoCSRFToken from "django-react-csrftoken";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import { LinkInfo } from "../../forms/LinkInfo.jsx";
import LinkList, { linkCaptions } from "../../forms/LinkList.jsx";
import LinkListStore, { NewLinkInfo } from "../../stores/LinkListStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { Dictionary } from "../../types/Generics.jsx";
import formHelper, { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import FormValidation from "../../forms/FormValidation.jsx";
import { OnReadySubmitFunc } from "./GroupFormCommon.jsx";
import { LinkTypes } from "../../constants/LinkConstants.js";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import url from "../../utils/url.js";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import _ from "lodash";

type FormFields = {|
  group_links: Array<LinkInfo>,
|} & Dictionary<string>;

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc,
|} & FormPropsBase<FormFields>;

type State = {|
  errorMessages: $ReadOnlyArray<string>,
  onSubmit: OnReadySubmitFunc,
|} & FormStateBase<FormFields>;

const resourceLinks: $ReadOnlyArray<string> = [
  LinkTypes.CODE_REPOSITORY,
  LinkTypes.MESSAGING,
  LinkTypes.PROJECT_MANAGEMENT,
  LinkTypes.FILE_REPOSITORY,
];

/**
 * Encapsulates form for Group Resources section
 */
class GroupResourcesForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    const group: GroupDetailsAPIData = props.project;
    const formFields: FormFields = {
      group_links: group ? group.group_links : [],
    };
    this.state = {
      formFields: formFields,
      onSubmit: this.onSubmit.bind(this),
    };
    this.form = formHelper.setup();
    UniversalDispatcher.dispatch({
      type: "SET_LINK_LIST",
      links: group.group_links,
      presetLinks: resourceLinks,
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
    let state: State = _.clone(prevState) || {
      formFields: {},
    };
    state.formFields.group_links = LinkListStore.getLinkList();
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
    let group_links: $ReadOnlyArray<NewLinkInfo> = LinkListStore.getLinkList();
    formFields.group_links = group_links.filter(
      (link: LinkInfo) => !_.isEmpty(link.linkUrl)
    );
    formFields.group_links.forEach((link: NewLinkInfo) => {
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
            group_links: JSON.stringify(
              this.state.formFields.group_links || []
            ),
          }}
        />

        <div className="form-group create-form-block">
          <LinkList
            title="Group Resources"
            subheader="Paste the links to your internal collaboration tools"
            linkNamePrefixExclude={["social_", LinkTypes.LINKED_IN]}
            linkOrdering={resourceLinks}
            addLinkText="Add a new link"
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

export default Container.create(GroupResourcesForm, { withProps: true });
