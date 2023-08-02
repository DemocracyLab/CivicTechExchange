// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import _ from "lodash";
import type { FileInfo } from "../../common/FileInfo.jsx";
import DateRangeSelectors from "../../common/datetime/DateRangeSelectors.jsx";
import ImageCropUploadFormElement from "../../../components/forms/ImageCropUploadFormElement.jsx";
import FormValidation, {
  Validator,
} from "../../../components/forms/FormValidation.jsx";
import type { EventData } from "../../utils/EventAPIUtils.js";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";

type FormFields = {|
  event_name: ?string,
  event_short_description: ?string,
  event_location: ?string,
  event_date_start: ?string,
  event_date_end: ?string,
  event_rsvp_url: ?string,
  event_thumbnail: ?FileInfo,
|};

type Props = {|
  event: ?EventData,
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Event Overview section
 */
class EventOverviewForm extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const event: EventData = props.project;
    const formFields: FormFields = {
      event_name: event ? event.event_name : "",
      event_organizers_text: event ? event.event_organizers_text : "",
      event_short_description: event ? event.event_short_description : "",
      event_location: event ? event.event_location : "",
      event_date_start: event ? new Date(event.event_date_start) : "",
      event_date_end: event ? new Date(event.event_date_end) : "",
      event_rsvp_url: event ? event.event_rsvp_url : "",
      event_thumbnail: event ? event.event_thumbnail : "",
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        fieldName: "event_name",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["event_name"]),
        errorMessage: "Please enter Event Name",
      },
      {
        fieldName: "event_short_description",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["event_short_description"]),
        errorMessage: "Please enter Event Description",
      },
      {
        fieldName: "event_location",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["event_location"]),
        errorMessage: "Please enter Event Location",
      },
      {
        fieldName: "event_date_start",
        checkFunc: (formFields: FormFields) =>
          formFields["event_date_end"] > formFields["event_date_start"],
        errorMessage: "End Date should come after Start Date",
      },
      {
        fieldName: "event_date_start",
        checkFunc: (formFields: FormFields) => !!formFields["event_date_start"],
        errorMessage: "Please enter Start Date",
      },
      {
        fieldName: "event_date_end",
        checkFunc: (formFields: FormFields) => !!formFields["event_date_end"],
        errorMessage: "Please enter End Date",
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
      formIsValid: formIsValid,
    };
    props.readyForSubmit(formIsValid);
  }

  render(): React$Node {
    return (
      <div className="EditEventForm-root">
        <DjangoCSRFToken />

        <div className="form-group">
          <ImageCropUploadFormElement
            form_id="event_thumbnail"
            buttonText="Upload Event Image"
          />
          <p>
            <em>
              For best results, event images should be approximately 2:1 aspect
              ratio
            </em>
          </p>
        </div>

        <TextFormField
          id="event_name"
          label="Event Name"
          type={TextFormFieldType.SingleLine}
          required={true}
          maxLength={60}
        />

        <TextFormField
          id="event_organizers_text"
          label="Event Organizers"
          type={TextFormFieldType.SingleLine}
          required={false}
          maxLength={200}
        />

        <TextFormField
          id="event_location"
          label="Location"
          type={TextFormFieldType.MultiLine}
          rows={3}
          placeholder="Location for this Event"
          required={true}
          showCount={true}
          maxLength={200}
        />

        <DateRangeSelectors
          dateTimeStart={this.state?.formFields?.event_date_start}
          dateTimeEnd={this.state?.formFields?.event_date_end}
          formIds={["event_date_start", "event_date_end"]}
        />

        <TextFormField
          id="event_rsvp_url"
          label="Eventbrite Link"
          type={TextFormFieldType.SingleLine}
          required={false}
          maxLength={2075}
        />

        <TextFormField
          id="event_short_description"
          label="Short Description"
          type={TextFormFieldType.MultiLine}
          rows={2}
          placeholder="Give a one-sentence description of this Event"
          required={true}
          showCount={true}
          maxLength={140}
        />
      </div>
    );
  }
}

export default EventOverviewForm;
