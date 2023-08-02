// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import { Validator } from "../../../components/forms/FormValidation.jsx";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { EventProjectAPIDetails } from "../../utils/EventProjectAPIUtils.js";

type FormFields = {|
  goal: ?string,
  scope: ?string,
  schedule: ?string,
  onboarding_notes: ?string,
|};

type Props = {|
  project: ?EventProjectAPIDetails,
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Project Description section
 */
class CreateEventProjectScope extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const eventProject: EventProjectAPIDetails = props.project;
    const formFields: FormFields = {
      goal: eventProject?.event_project_goal || "",
      scope: eventProject?.event_project_scope || "",
      schedule: eventProject?.event_project_agenda || "",
      onboarding_notes: eventProject?.event_project_onboarding_notes || "",
    };

    UniversalDispatcher.dispatch({
      type: "SET_FORM_FIELDS",
      formFieldValues: formFields,
      validators: [],
    });

    const formIsValid: boolean = true;
    this.state = {
      formIsValid: formIsValid,
    };
    props.readyForSubmit(formIsValid);
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <h3>
          We will import the "About", "Solution" and "Problem" sections of your
          hackathon project profile from your long-term project profile. To make
          changes, please visit your long-term project profile and click "Edit"
        </h3>

        <TextFormField
          id="goal"
          label="Hackathon Project Goal"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder="In one to five sentences, please describe what your team hopes to accomplish during the hackathon."
          required={false}
          showCount={true}
          maxLength={1000}
        />

        <TextFormField
          id="scope"
          label="Planned Scope of Hackathon Project"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder="What should your team aim to deliver by the end of the hackathon?"
          required={false}
          showCount={true}
          maxLength={1000}
        />

        <TextFormField
          id="schedule"
          label="Schedule for Hackathon Team (please include a time zone)"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder={
            "Please provide a schedule to guide your team through the hackathon.\n\n" +
            'e.g. 11:00 AM PST: Teams start working on the "Climathonians" Mobile App.\n\n' +
            "12:00 AM PST: Break"
          }
          required={false}
          showCount={true}
          maxLength={1000}
        />

        <TextFormField
          id="onboarding_notes"
          label="Additional Onboarding Notes for Volunteers"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder={
            "Please provide any information that will help your team prepare for the hackathon.\n" +
            "We will ask you to share links to internal resources in the next step."
          }
          required={false}
          showCount={true}
          maxLength={1000}
        />
      </div>
    );
  }
}

export default CreateEventProjectScope;
