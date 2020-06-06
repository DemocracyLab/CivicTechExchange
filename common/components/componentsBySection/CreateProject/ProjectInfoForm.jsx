// @flow

import React from "react";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import {OnReadySubmitFunc} from "./ProjectFormCommon.jsx";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {TagDefinition, ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import formHelper, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";
import url from "../../utils/url.js";
import {CountrySelector} from "../../common/selection/CountrySelector.jsx";
import {CountryCodeFormats, CountryData, countryByCode} from "../../constants/Countries.js";
import LocationAutocomplete from "../../common/location/LocationAutocomplete.jsx";


type FormFields = {|
  project_country: ?string,
  project_url: ?string,
  project_stage?: Array<TagDefinition>,
  project_organization?: Array<TagDefinition>,
  project_technologies?: Array<TagDefinition>,
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Project Info section
 */
class ProjectInfoForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    const formFields: FormFields = {
      project_country: project ? project.project_country : "",
      project_url: project ? project.project_url : "",
      project_stage: project ? project.project_stage : [],
      project_organization: project ? project.project_organization : [],
      project_organization_type:
        project ? project.project_organization_type : [],
      project_technologies: project ? project.project_technologies : []
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) => url.isEmptyStringOrValidUrl(
          formFields["project_url"]),
        errorMessage: "Please enter valid URL."
      }
    ];
    const formIsValid: boolean = FormValidation.isValid(
      formFields, validations);
    this.state = {
      formIsValid: formIsValid,
      formFields: formFields,
      validations: validations
    };
    props.readyForSubmit(formIsValid);
    this.form = formHelper.setup();
  }

  componentDidMount() {
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
          <label>Country</label>
          <CountrySelector
            id="project_country"
            countryCode={this.state.formFields.project_country}
            countryCodeFormat={CountryCodeFormats.ISO_2}
            onSelection={this.form.onSelection.bind(this, "project_country")}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="project_url">Website URL</label>
          <input type="text" className="form-control" id="project_url" name="project_url" maxLength="2075"
                 value={this.state.formFields.project_url} onChange={this.form.onInput.bind(this, "project_url")}/>
        </div>

        <div className="form-group">
          <label>Project Stage</label>
          <TagSelector
            elementId="project_stage"
            value={this.state.formFields.project_stage}
            category={TagCategory.PROJECT_STAGE}
            allowMultiSelect={false}
            onSelection={this.form.onSelection.bind(this, "project_stage")}
          />
        </div>

        <div className="form-group">
          <label>Organization</label>
          <TagSelector
            elementId="project_organization"
            value={this.state.formFields.project_organization}
            category={TagCategory.ORGANIZATION}
            allowMultiSelect={true}
            onSelection={this.form.onSelection.bind(this, "project_organization")}
          />
        </div>

        <div className="form-group">
          <label>Organization Type</label>
          <TagSelector
            elementId="project_organization_type"
            value={this.state.formFields.project_organization_type}
            category={TagCategory.ORGANIZATION_TYPE}
            allowMultiSelect={false}
            onSelection={this.form.onSelection.bind(this, "project_organization_type")}
          />
        </div>

        <div className="form-group">
          <label>Technology Used</label>
          <TagSelector
            elementId="project_technologies"
            value={this.state.formFields.project_technologies}
            category={TagCategory.TECHNOLOGIES_USED}
            allowMultiSelect={true}
            onSelection={this.form.onSelection.bind(this, "project_technologies")}
          />
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

export default ProjectInfoForm;
