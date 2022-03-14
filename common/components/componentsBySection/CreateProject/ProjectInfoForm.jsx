// @flow

import React from "react";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import { OnReadySubmitFunc } from "./ProjectFormCommon.jsx";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type { Validator } from "../../forms/FormValidation.jsx";
import type {
  TagDefinition,
  ProjectDetailsAPIData,
} from "../../utils/ProjectAPIUtils.js";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import url from "../../utils/url.js";
import { CountryData, countryByCode } from "../../constants/Countries.js";
import {
  LocationInfo,
  getLocationInfoFromProject,
} from "../../common/location/LocationInfo.js";
import { LocationFormInputsByEntity } from "../../forms/LocationAutocompleteForm.jsx";
import CurrentUser from "../../utils/CurrentUser.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import CountryLocationFormFields from "../../forms/fields/CountryLocationFormFields.jsx";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";

type FormFields = {|
  project_country: ?CountryData,
  project_location: ?LocationInfo,
  project_url: ?string,
  project_stage?: Array<TagDefinition>,
  project_organization?: Array<TagDefinition>,
  project_technologies?: Array<TagDefinition>,
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc,
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Project Info section
 */
class ProjectInfoForm extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    const formFields: FormFields = {
      project_country: project ? countryByCode(project.project_country) : null,
      project_location: project ? getLocationInfoFromProject(project) : null,
      project_url: project ? project.project_url : "",
      project_stage: project ? project.project_stage : [],
      project_organization: project ? project.project_organization : [],
      project_organization_type: project
        ? project.project_organization_type
        : [],
      project_technologies: project ? project.project_technologies : [],
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        fieldName: "project_url",
        checkFunc: (formFields: FormFields) =>
          url.isEmptyStringOrValidUrl(formFields["project_url"]),
        errorMessage: "Please enter valid URL.",
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
      formFields: formFields,
    };
    props.readyForSubmit(formIsValid);
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <CountryLocationFormFields
          countryFieldId="project_country"
          locationFieldId="project_location"
          locationFormInputs={LocationFormInputsByEntity.Projects}
        />

        <TextFormField
          id="project_url"
          label="Website URL"
          type={TextFormFieldType.SingleLine}
          required={false}
          maxLength={2075}
        />

        <div className="form-group">
          <label>Project Stage</label>
          <TagSelector
            elementId="project_stage"
            category={TagCategory.PROJECT_STAGE}
            allowMultiSelect={false}
            useFormFieldsStore={true}
          />
        </div>

        {/* Only show to Admin */}
        {CurrentUser.isStaff() && (
          <div className="form-group">
            <label>Organization</label>
            <TagSelector
              elementId="project_organization"
              category={TagCategory.ORGANIZATION}
              allowMultiSelect={true}
              useFormFieldsStore={true}
            />
          </div>
        )}

        <div className="form-group">
          <label>Organization Type</label>
          <TagSelector
            elementId="project_organization_type"
            category={TagCategory.ORGANIZATION_TYPE}
            allowMultiSelect={false}
            useFormFieldsStore={true}
          />
        </div>

        <div className="form-group">
          <label>Technology Used</label>
          <TagSelector
            elementId="project_technologies"
            category={TagCategory.TECHNOLOGIES_USED}
            allowMultiSelect={true}
            useFormFieldsStore={true}
          />
        </div>
      </div>
    );
  }
}

export default ProjectInfoForm;
