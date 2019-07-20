// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";


type FormFields = {|
  project_description: ?string,
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
 * Encapsulates form for Project Description section
 */
class ProjectDescriptionForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    this.state = {
      formIsValid: false,
      formFields: {
        project_description: project ? project.project_description : "",
      },
      validations: [
        {
          checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_description"]),
          errorMessage: "Please enter Project Description"
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
            Describe This Project { }
            {
              window.PROJECT_DESCRIPTION_EXAMPLE_URL
                ? (
                  <a className="label-hint" target="_blank" rel="noopener noreferrer" href={_.unescape(window.PROJECT_DESCRIPTION_EXAMPLE_URL)}>
                    (Example)
                  </a>
                )
                : null
            }
          </label>
          <div className="character-count">
            { (this.state.formFields.project_description || "").length} / 3000
          </div>
          <textarea className="form-control" id="project_description" name="project_description"
                    placeholder="Tell us what you're doing and why it's important" rows="6" maxLength="3000"
                    value={this.state.formFields.project_description} onChange={this.form.onInput.bind(this, "project_description")}></textarea>
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