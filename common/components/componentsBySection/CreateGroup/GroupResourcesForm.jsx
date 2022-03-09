// @flow

import React from "react";
import { Container } from "flux/utils";
import DjangoCSRFToken from "django-react-csrftoken";
import { LinkInfo } from "../../forms/LinkInfo.jsx";
import LinkList, {
  compileLinkFormFields,
  linkCaptions,
} from "../../forms/LinkList.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { Dictionary } from "../../types/Generics.jsx";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import { OnReadySubmitFunc } from "./GroupFormCommon.jsx";
import { LinkTypes } from "../../constants/LinkConstants.js";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import _ from "lodash";

type FormFields = {|
  group_links: Array<LinkInfo>,
|} & Dictionary<string>;

type Props = {|
  project: ?GroupDetailsAPIData,
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
            group_links:
              this.state.formFields &&
              JSON.stringify(
                compileLinkFormFields(
                  this.state.formFields.group_links,
                  _.omit(this.state.formFields, ["group_links"])
                ) || []
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
            links={this.state.formFields.group_links}
          />
        </div>
      </div>
    );
  }
}

export default Container.create(GroupResourcesForm, { withProps: true });
