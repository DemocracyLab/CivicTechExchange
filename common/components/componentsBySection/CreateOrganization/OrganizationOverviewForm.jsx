// @flow

import React from "react";
import type {FileInfo} from "../../common/FileInfo.jsx";
import ImageUploadFormElement from "../../../components/forms/ImageUploadFormElement.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {TagDefinition, OrganizationDetailsAPIData} from "../../../components/utils/OrganizationAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";


type FormFields = {|
  organization_name: ?string,
  organization_short_description: ?string,
  organization_issue_area?: Array<TagDefinition>,
  organization_thumbnail?: FileInfo,
|};

type Props = {|
  organization: ?OrganizationDetailsAPIData,
  readyForSubmit: () => () => boolean
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Organization Overview section
 */
class OrganizationOverviewForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const organization: OrganizationDetailsAPIData = props.organization;
    const formFields: FormFields = {
      organization_name: organization ? organization.organization_name : "",
      organization_short_description: organization ? organization.organization_short_description : "",
      organization_issue_area: organization ? organization.organization_issue_area : [],
      organization_thumbnail: organization ? organization.organization_thumbnail : ""
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["organization_name"]),
        errorMessage: "Please enter Organization Name"
      },
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["organization_short_description"]),
        errorMessage: "Please enter Organization Description"
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
      <div className="EditOrganizationForm-root">

        <DjangoCSRFToken/>

        <div className="form-group">
          <ImageUploadFormElement form_id="organization_thumbnail_location"
                                  buttonText="Upload Organization Image"
                                  currentImage={this.state.formFields.organization_thumbnail}
                                  onSelection={this.form.onSelection.bind(this, "organization_thumbnail")}
          />
        </div>

        <div className="form-group">
          <label>Organization Name</label>
          <input type="text" className="form-control" id="organization_name" name="organization_name" maxLength="60"
                 value={this.state.formFields.organization_name} onChange={this.form.onInput.bind(this, "organization_name")}/>
        </div>

        <div className="form-group">
          <label>Issue Area</label>
          <TagSelector
            elementId="organization_issue_area"
            value={this.state.formFields.organization_issue_area}
            category={TagCategory.ISSUES}
            allowMultiSelect={false}
            onSelection={this.form.onSelection.bind(this, "organization_issue_area")}
          />
        </div>
  
        <div className="form-group">
          <label>
            Short Description
          </label>
          <div className="character-count">
            { (this.state.formFields.organization_short_description || "").length} / 140
          </div>
          <textarea className="form-control" id="organization_short_description" name="organization_short_description"
                    placeholder="Give a one-sentence description of this Organization" rows="2" maxLength="140"
                    value={this.state.formFields.organization_short_description} onChange={this.form.onInput.bind(this, "organization_short_description")}></textarea>
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

export default OrganizationOverviewForm;
