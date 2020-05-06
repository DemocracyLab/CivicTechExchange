// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";


type FormFields = {|
  event_description: ?string,
  event_agenda: ?string,
  event_live_id: ?string
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: () => () => boolean
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Event Description section
 */
class ProjectDescriptionForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const event: ProjectDetailsAPIData = props.project;
    // TODO: Include qiqochat event link
    this.state = {
      formIsValid: false,
      formFields: {
        event_description: event ? event.event_description : "",
        event_agenda: event ? event.event_agenda : "",
        event_live_id: event ? event.event_live_id : ""
      },
      validations: [
        {
          checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["event_description"]),
          errorMessage: "Please enter Event Description"
        }, {
          checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["event_agenda"]),
          errorMessage: "Please enter Event Agenda"
        }
      ]
    };
    
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
      <div className="EditProjectForm-root">

        <DjangoCSRFToken/>
  
        <div className="form-group">
          <label>
            <strong>Description</strong>
          </label>
          <div className="character-count">
            { (this.state.formFields.event_description || "").length} / 4000
          </div>
          <textarea className="form-control" id="event_description" name="event_description"
                    placeholder="Describe the problem your project is solving..." rows="6" maxLength="4000"
                    value={this.state.formFields.event_description} onChange={this.form.onInput.bind(this, "event_description")}>
          </textarea>
          *Required
        </div>

        <div className="form-group">
          <label>
            <strong>Agenda</strong>
          </label>
          <div className="character-count">
            { (this.state.formFields.event_agenda || "").length} / 4000
          </div>
          <textarea className="form-control" id="event_agenda" name="event_agenda"
                    placeholder="Describe the solution you plan to build..." rows="6" maxLength="4000"
                    value={this.state.formFields.event_agenda} onChange={this.form.onInput.bind(this, "event_agenda")}></textarea>
        </div>
  
        <div className="form-group">
          <label>QiqoChat Live Event ID (Optional)</label>
          <input type="text" className="form-control" id="event_live_id" name="event_live_id" maxLength="50"
                 value={this.state.formFields.event_live_id} onChange={this.form.onInput.bind(this, "event_live_id")}/>
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

export default ProjectDescriptionForm;