// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type { Validator } from "../../forms/FormValidation";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import TagSelector from "../../common/tags/TagSelector.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import type { TagDefinition } from "../../utils/ProjectAPIUtils";
import type { EventData } from "../../utils/EventAPIUtils.js";
import CurrentUser from "../../utils/CurrentUser.js";
import CheckBox from "../../common/selection/CheckBox.jsx";
import _ from "lodash";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";
import type { Dictionary } from "../../types/Generics.jsx";
import stringHelper from "../../utils/string.js";

type FormFields = {|
  event_description: ?string,
  event_agenda: ?string,
  event_live_id: ?string,
  event_legacy_organization: ?$ReadOnlyArray<TagDefinition>,
  event_slug: ?string,
  is_private: ?boolean,
  show_headers: ?boolean,
|};

type Props = {|
  project: ?EventData,
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Event Description section
 */
class ProjectDescriptionForm extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const event: EventData = props.project;
    const formFields: Dictionary<any> = {
      event_description: event ? event.event_description : "",
      event_agenda: event ? event.event_agenda : "",
      event_live_id: event ? event.event_live_id : "",
      event_legacy_organization: event ? event.event_legacy_organization : "",
      event_slug: event ? event.event_slug : "",
      is_private: event ? event.is_private : false,
      show_headers: event ? event.show_headers : false,
    };

    const validations: $ReadOnlyArray<Validator> = [
      {
        fieldName: "event_description",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["event_description"]),
        errorMessage: "Please enter Event Description",
      },
      {
        fieldName: "event_agenda",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["event_agenda"]),
        errorMessage: "Please enter Event Agenda",
      },
      {
        fieldName: "event_slug",
        checkFunc: (formFields: FormFields) =>
          stringHelper.isValidSlug(formFields["event_slug"]),
        errorMessage:
          "Valid Event slug should only consist of alphanumeric characters and dashes('-')",
      },
    ];

    const formIsValid: boolean = FormValidation.isValid(
      formFields,
      validations
    );

    this.state = {
      formIsValid: formIsValid,
      formFields: formFields,
    };

    UniversalDispatcher.dispatch({
      type: "SET_FORM_FIELDS",
      formFieldValues: formFields,
      validators: validations,
    });

    props.readyForSubmit(formIsValid);
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <TextFormField
          id="event_description"
          label="Description"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder="Describe the Event"
          required={true}
          showCount={true}
          maxLength={4000}
        />

        <TextFormField
          id="event_agenda"
          label="Agenda"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder="List the items on the Event's agenda"
          required={true}
          showCount={true}
          maxLength={4000}
        />

        {CurrentUser.isStaff() && this._renderAdminControls()}
      </div>
    );
  }

  _renderAdminControls(): React$Node {
    return (
      <React.Fragment>
        <TextFormField
          id="event_slug"
          label="Event Url Slug"
          type={TextFormFieldType.SingleLine}
          required={false}
          maxLength={60}
        />

        <CheckBox id="is_private" label="Private Event" />

        <CheckBox id="show_headers" label="Show Sponsor Footer" />

        <div className="form-group">
          <label>Legacy Organization (Optional)</label>
          <TagSelector
            elementId="event_legacy_organization"
            category={TagCategory.ORGANIZATION}
            allowMultiSelect={false}
            useFormFieldsStore={true}
          />
        </div>

        <TextFormField
          id="event_live_id"
          label="QiqoChat Live Event ID (Optional)"
          type={TextFormFieldType.SingleLine}
          required={false}
          maxLength={50}
        />
      </React.Fragment>
    );
  }
}

export default ProjectDescriptionForm;
