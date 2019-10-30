// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import formHelper, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";


type FormFields = {|
  project_description: ?string,
  project_description_solution: ?string,
  project_description_actions: ?string,
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
        project_description_solution: project ? project.project_description_solution : "",
        project_description_actions: project ? project.project_description_actions : ""
      },
      validations: [
        {
          checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["project_description"]),
          errorMessage: "Please enter Project Problem"
        }
      ]
    };

    this.form = formHelper.setup();
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
            <strong>Problem*</strong>
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
            { (this.state.formFields.project_description || "").length} / 1000
          </div>
          <textarea className="form-control" id="project_description" name="project_description"
                    placeholder="Describe the problem your project is solving..." rows="6" maxLength="1000"
                    value={this.state.formFields.project_description} onChange={this.form.onInput.bind(this, "project_description")}>
          </textarea>
          *Required
        </div>

        <div className="form-group">
          <label>
            <strong>Solution</strong>
          </label>
          <div className="character-count">
            { (this.state.formFields.project_description_solution || "").length} / 1000
          </div>
          <textarea className="form-control" id="project_description_solution" name="project_description_solution"
                    placeholder="Describe the solution you plan to build..." rows="6" maxLength="1000"
                    value={this.state.formFields.project_description_solution} onChange={this.form.onInput.bind(this, "project_description_solution")}></textarea>
        </div>

        <div className="form-group">
          <label>
            <strong>Action(s)</strong>
          </label>
          <div className="character-count">
            { (this.state.formFields.project_description_actions || "").length} / 1000
          </div>
          <textarea className="form-control" id="project_description_actions" name="project_description_actions"
                    placeholder="Describe the actions that needed to be token..." rows="6" maxLength="1000"
                    value={this.state.formFields.project_description_actions} onChange={this.form.onInput.bind(this, "project_description_actions")}></textarea>
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
