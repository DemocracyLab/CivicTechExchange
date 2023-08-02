// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation, {
  Validator,
} from "../../../components/forms/FormValidation.jsx";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import _ from "lodash";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { FormFieldValidator } from "../../utils/validation.js";

type FormFields = {|
  project_description: ?string,
  project_description_solution: ?string,
  project_description_actions: ?string,
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Project Description section
 */
class ProjectDescriptionForm extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    const formFields: FormFields = {
      project_description: project ? project.project_description : "",
      project_description_solution: project
        ? project.project_description_solution
        : "",
      project_description_actions: project
        ? project.project_description_actions
        : "",
    };
    const validations: $ReadOnlyArray<FormFieldValidator<FormFields>> = [
      {
        fieldName: "project_description",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["project_description"]),
        errorMessage: "Please enter Project Problem",
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
      termsOpen: false,
    };
    props.readyForSubmit(formIsValid);
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <TextFormField
          id="project_description"
          label="Problem"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder="Describe the problem your project is solving..."
          required={true}
          showCount={true}
          maxLength={1000}
          exampleLink={
            window.PROJECT_DESCRIPTION_EXAMPLE_URL &&
            _.unescape(window.PROJECT_DESCRIPTION_EXAMPLE_URL)
          }
        />

        <TextFormField
          id="project_description_solution"
          label="Solution"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder="Describe the solution you plan to build..."
          required={false}
          showCount={true}
          maxLength={1000}
        />

        <TextFormField
          id="project_description_actions"
          label="Action(s)"
          type={TextFormFieldType.MultiLine}
          rows={6}
          placeholder="Describe the actions that need to be taken..."
          required={false}
          showCount={true}
          maxLength={1000}
        />
      </div>
    );
  }
}

export default ProjectDescriptionForm;
