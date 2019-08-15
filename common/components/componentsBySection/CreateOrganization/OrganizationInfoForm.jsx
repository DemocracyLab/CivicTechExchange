// @flow

import React from "react";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import {OnReadySubmitFunc} from "./OrganizationFormCommon.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {TagDefinition, ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import {Locations} from "../../constants/ProjectConstants.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";


type FormFields = {|
  project_location: ?string,
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
    this.state = {
      formIsValid: true,
      formFields: {
        project_location: project ? project.project_location : "",
        project_url: project ? project.project_url : "",
        project_stage: project ? project.project_stage : [],
        project_organization: project ? project.project_organization : [],
        project_organization_type: project ? project.project_organization_type : [],
        project_technologies: project ? project.project_technologies : []
      },
      validations: []
    };
  
    this.form = form.setup();
    // All fields optional
    props.readyForSubmit(true);
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">

        <DjangoCSRFToken/>
  
        <div className="form-group">
          <label htmlFor="project_location">Project Location</label>
          <select name="project_location" id="project_location" className="form-control" value={this.state.formFields.project_location} onChange={this.form.onInput.bind(this, "project_location")}>
            {!_.includes(Locations.PRESET_LOCATIONS, this.state.formFields.project_location) ? <option value={this.state.formFields.project_location}>{this.state.formFields.project_location}</option> : null}
            {Locations.PRESET_LOCATIONS.map(location => <option key={location} value={location}>{location}</option>)}
          </select>
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

      </div>
    );
  }
}

export default ProjectInfoForm;