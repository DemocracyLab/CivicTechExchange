// @flow

import React from "react";
import type {FileInfo} from "../../common/FileInfo.jsx";
import DateRangeSelectors from "../../common/datetime/DateRangeSelectors.jsx";
import ImageCropUploadFormElement from "../../../components/forms/ImageCropUploadFormElement.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {EventDetailsAPIData} from "../../../components/utils/EventAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";


type FormFields = {|
  event_name: ?string,
  event_short_description: ?string,
  event_date_start: ?string,
  event_date_end: ?string,
  event_thumbnail?: FileInfo,
|};

type Props = {|
  event: ?EventDetailsAPIData,
  readyForSubmit: () => () => boolean
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Event Overview section
 */
class EventOverviewForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const event: EventDetailsAPIData = props.project;
    const formFields: FormFields = {
      event_name: event ? event.event_name : "",
      event_short_description: event ? event.event_short_description : "",
      event_date_start: event ? new Date(event.event_date_start) : "",
      event_date_end: event ? new Date(event.event_date_end) : "",
      event_thumbnail: event ? event.event_thumbnail : ""
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["event_name"]),
        errorMessage: "Please enter Event Name"
      }, {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["event_short_description"]),
        errorMessage: "Please enter Event Description"
      }, {
        checkFunc: (formFields: FormFields) => !!(formFields["event_date_start"]),
        errorMessage: "Please enter Start Date"
      }, {
        checkFunc: (formFields: FormFields) => !!(formFields["event_date_end"]),
        errorMessage: "Please enter End Date"
      }
    ];
  
    const formIsValid: boolean = FormValidation.isValid(formFields, validations);
    this.state = {
      formIsValid: formIsValid,
      formFields: formFields,
      validations: validations
    };
    props.readyForSubmit(formIsValid);
    this.form = form.setup();
  }
  
  componentDidMount() {
    // Initial validation check
    this.form.doValidation.bind(this)();
  }

  onValidationCheck(formIsValid: boolean): void {
    if(formIsValid !== this.state.formIsValid) {
      this.setState({formIsValid});
      this.props.readyForSubmit(formIsValid);
    }
  }

  render(): React$Node {
    
    return (
      <div className="EditEventForm-root">

        <DjangoCSRFToken/>

        <div className="form-group">
          <ImageCropUploadFormElement form_id="event_thumbnail_location"
                                  buttonText="Upload Event Image"
                                  currentImage={this.state.formFields.event_thumbnail}
                                  onSelection={this.form.onSelection.bind(this, "event_thumbnail")}
          />
        </div>

        <div className="form-group">
          <label>Event Name</label>
          <input type="text" className="form-control" id="event_name" name="event_name" maxLength="60"
                 value={this.state.formFields.event_name} onChange={this.form.onInput.bind(this, "event_name")}/>
        </div>
        
        <DateRangeSelectors
          dateTimeStart={this.state.formFields.event_date_start}
          dateTimeEnd={this.state.formFields.event_date_end}
          onChangeTimeStart={this.form.onSelection.bind(this, "event_date_start")}
          onChangeTimeEnd={this.form.onSelection.bind(this, "event_date_end")}
          formIds={["event_date_start","event_date_end"]}
        />
  
        <div className="form-group">
          <label>
            Short Description
          </label>
          <div className="character-count">
            { (this.state.formFields.event_short_description || "").length} / 140
          </div>
          <textarea className="form-control" id="event_short_description" name="event_short_description"
                    placeholder="Give a one-sentence description of this Event" rows="2" maxLength="140"
                    value={this.state.formFields.event_short_description} onChange={this.form.onInput.bind(this, "event_short_description")}></textarea>
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

export default EventOverviewForm;
