// @flow

import React from "react";
import { Container } from "flux/utils";
import DjangoCSRFToken from "django-react-csrftoken";
import _ from "lodash";
import { LinkInfo } from "../../forms/LinkInfo.jsx";
import LinkList, { compileLinkFormFields } from "../../forms/LinkList.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { Dictionary } from "../../types/Generics.jsx";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import type { OnReadySubmitFunc } from "../CreateProject/ProjectFormCommon.jsx";
import { LinkTypes } from "../../constants/LinkConstants.js";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import type { EventProjectAPIDetails } from "../../utils/EventProjectAPIUtils.js";

type FormFields = {|
  event_project_links: Array<LinkInfo>,
|} & Dictionary<string>;

type Props = {|
  project: ?EventProjectAPIDetails,
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

/**
 * Encapsulates form for Event Project Resources section
 */
class EventProjectResourcesForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    const eventProject: EventProjectAPIDetails = props.project;
    const formFields: FormFields = {
      event_project_links: eventProject ? eventProject.event_project_links : [],
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
            event_project_links:
              this.state.formFields &&
              JSON.stringify(
                compileLinkFormFields(
                  this.state.formFields.event_project_links,
                  _.omit(this.state.formFields, ["event_project_links"])
                ) || []
              ),
          }}
        />

        <div className="form-group create-form-block">
          <LinkList
            title="Pitch Video"
            subheader={
              "Please provide a YouTube link for your hackathon pitch. " +
              "The pitch video will appear on the main hackathon page and the hackathon project page."
            }
            linkNamePrefix={LinkTypes.VIDEO}
            linkOrdering={[LinkTypes.VIDEO]}
            links={this.props.project.event_project_links}
          />
        </div>

        <div className="form-group create-form-block">
          <LinkList
            title="Links"
            subheader={
              "We have imported the internal collaboration tools from your project profile.  " +
              "Please make changes if needed.  Any changes below will not impact your project profile."
            }
            linkNamePrefixExclude={[LinkTypes.VIDEO]}
            linkOrdering={resourceLinks}
            addLinkText="Add a new link"
            links={this.props.project.event_project_links}
          />
        </div>
      </div>
    );
  }
}

export default Container.create(EventProjectResourcesForm, { withProps: true });
