// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import { Container } from "flux/utils";
import _ from "lodash";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type { Validator } from "../../forms/FormValidation.jsx";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { FormFieldValidator } from "../../utils/validation.js";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import type { EventProjectAPIDetails } from "../../utils/EventProjectAPIUtils.js";
import type { EventData } from "../../utils/EventAPIUtils.js";
import InlineFormError from "../../forms/InlineFormError.jsx";
import CurrentUser, {
  UserContext,
  MyProjectData,
} from "../../utils/CurrentUser.js";
import FormSelector from "../../common/selection/FormSelector.jsx";
import HiddenFormFields from "../../forms/HiddenFormFields.jsx";
import url from "../../utils/url.js";
import RemoteInPersonSelector from "../../common/events/RemoteInPersonSelector.jsx";
import LocationTimezoneSelector from "../../common/events/LocationTimezoneSelector.jsx";
import EventAPIUtils, { LocationTimezone } from "../../utils/EventAPIUtils.js";

type FormFields = {|
  project_id: number,
  is_remote: boolean,
  event_time_zone: LocationTimezone
|};

type Props = {|
  project: ?EventProjectAPIDetails,
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  event: ?EventData,
  owned_projects: $ReadOnlyArray<MyProjectData>,
  isAlreadySelected: boolean,
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for selecting project to RSVP for event
 */
class CreateEventProjectSelect extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    const userContext: UserContext = CurrentUser.userContext();
    const owned_projects: $ReadOnlyArray<MyProjectData> =
      userContext.owned_projects;
    if (!props.project) {
      const eventId: string = url.argument("event_id");
      EventAPIUtils.fetchEventDetails(eventId, (event: EventData) =>
        this.setState({ event }, null)
      );
    }
    const projectId: ?number = url.argument("project_id");
    const formFields: FormFields = {
      project_id: projectId,
      project:
        owned_projects &&
        owned_projects.find(
          (project: MyProjectData) => project.project_id == projectId
        ),
    };

    // TODO: Add validations for location/timezone
    const validations: $ReadOnlyArray<FormFieldValidator<FormFields>> = [
      {
        fieldName: "project",
        checkFunc: (formFields: FormFields) => {
          const valid: boolean = !_.isEmpty(formFields["project"]);
          return valid;
        },
        errorMessage: "Please Select Project",
      },
      {
        fieldName: "is_remote",
        checkFunc: (formFields: FormFields) => {
          const valid: boolean = !_.isEmpty(formFields["is_remote"]);
          return valid;
        },
        errorMessage: "Please Select Remote/In-Person",
      },
      {
        fieldName: "event_time_zone",
        checkFunc: (formFields: FormFields) => {
          const valid: boolean = !_.isEmpty(formFields["event_time_zone"]);
          return valid;
        },
        errorMessage: "Please Select Location/Timezone",
      },
    ];

    UniversalDispatcher.dispatch({
      type: "SET_FORM_FIELDS",
      formFieldValues: formFields,
      validators: validations,
    });

    const formIsValid: boolean = FormValidation.isValid(
      formFields,
      validations
    );
    this.state = {
      formFields: formFields,
      formIsValid: formIsValid,
      owned_projects: owned_projects,
      isAlreadySelected: !!formFields.project_id,
    };
    props.readyForSubmit(formIsValid);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    if (prevState?.formFields) {
      let state: State = _.clone(prevState) || {};
      state.formFields.project = FormFieldsStore.getFormFieldValue("project");
      state.isRemote = FormFieldsStore.getFormFieldValue("is_remote");
      state.formFields.project_id = state.formFields.project?.project_id;
      return state;
    }
    return prevState;
  }

  render(): React$Node {
    const locations: $ReadOnlyArray<LocationTimezone> = (
      this.state.event || this.props.project
    )?.event_time_zones;
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        {/* TODO: Make this Form.Group? */}
        <div className="form-group">
          <label>Please select one project to submit to the hackathon*</label>
          <HiddenFormFields
            sourceDict={{
              project_id: this.state.formFields.project_id,
            }}
          />
          <FormSelector
            id="project"
            placeholder="Select Project"
            isSearchable={true}
            isClearable={false}
            isMultiSelect={false}
            isDisabled={this.state.isAlreadySelected}
            options={this.state.owned_projects}
            labelGenerator={(project: MyProjectData) => project.project_name}
            valueStringGenerator={(project: MyProjectData) =>
              project.project_id
            }
          />
          <InlineFormError id="project" />
        </div>
        {locations && (
          // TODO: Read successfully from these fields
          <React.Fragment>
            <div className="form-group">
              <RemoteInPersonSelector
                elementId="is_remote"
                isRemote={this.state.isRemote}
                useFormFieldsStore={true}
              />
              <InlineFormError id="is_remote" />
            </div>
            <div className="form-group">
              <LocationTimezoneSelector
                elementId="event_time_zone"
                value={this.state.locationTimeZone}
                show_timezone={this.state.isRemote}
                location_timezones={locations}
                useFormFieldsStore={true}
              />
              <InlineFormError id="event_time_zone" />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Container.create(CreateEventProjectSelect, {
  withProps: true,
});
