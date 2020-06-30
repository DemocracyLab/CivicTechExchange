// @flow

import React from "react";
import type {FileInfo} from "../../common/FileInfo.jsx";
import ImageCropUploadFormElement from "../../../components/forms/ImageCropUploadFormElement.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {GroupDetailsAPIData} from "../../../components/utils/GroupAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import {CountrySelector} from "../../common/selection/CountrySelector.jsx";
import {CountryData, CountryCodeFormats, countryByCode} from "../../constants/Countries.js";
import {LocationAutocompleteForm, LocationFormInputsByEntity} from "../../forms/LocationAutocompleteForm.jsx";
import {LocationInfo, getLocationInfoFromGroup} from "../../common/location/LocationInfo.js";
import _ from "lodash";


type FormFields = {|
  group_name: ?string,
  group_country: ?CountryData,
  group_location: ?LocationInfo,
  group_description: ?string,
  group_short_description: ?string,
  group_thumbnail?: FileInfo,
|};

type Props = {|
  group: ?GroupDetailsAPIData,
  readyForSubmit: () => () => boolean
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Group Overview section
 */
class GroupOverviewForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const group: GroupDetailsAPIData = props.project;
    const formFields: FormFields = {
      group_name: group ? group.group_name : "",
      group_thumbnail: group ? group.group_thumbnail : "",
      group_country: group ? countryByCode(group.group_country) : null,
      group_location: group ? getLocationInfoFromGroup(group) : null,
      group_description: group ? group.group_description : "",
      group_short_description: group ? group.group_short_description : "",
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["group_name"]),
        errorMessage: "Please enter Group Name"
      },
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["group_description"]),
        errorMessage: "Please enter a one-sentence description"
      },
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["group_short_description"]),
        errorMessage: "Please enter Group Description"
      },
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
      <div className="EditGroupForm-root">

        <DjangoCSRFToken/>

        <div className="form-group">
          <ImageCropUploadFormElement
            form_id="group_thumbnail_location"
            buttonText="Upload Group Image"
            currentImage={this.state.formFields.group_thumbnail}
            onSelection={this.form.onSelection.bind(this, "group_thumbnail")}
          />
        </div>

        <div className="form-group">
          <label>Group Name</label>
          <input
            id="group_name"
            name="group_name"
            placeholder="Group Name"
            type="text"
            maxLength="60"
            className="form-control"
            value={this.state.formFields.group_name}
            onChange={this.form.onInput.bind(this, "group_name")}
          />
        </div>
  
        <div className="form-group">
          <label>Country</label>
          <CountrySelector
            id="group_country"
            countryCode={this.state.formFields.group_country && this.state.formFields.group_country.ISO_2}
            countryCodeFormat={CountryCodeFormats.ISO_2}
            onSelection={this.form.onSelection.bind(this, "group_country")}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <LocationAutocompleteForm
            country={this.state.formFields.group_country}
            onSelect={this.form.onSelection.bind(this, "group_location")}
            location={this.state.formFields.group_location}
            formInputs={LocationFormInputsByEntity.Groups}
          />
        </div>

        <div className="form-group">
          <label>Short Description</label>
          <div className="character-count">
            { (this.state.formFields.group_short_description || "").length} / 50
          </div>
          <input
            id="group_short_description"
            name="group_short_description"
            placeholder="Group Description"
            type="text"
            maxLength="50"
            className="form-control"
            value={this.state.formFields.group_short_description}
            onChange={this.form.onInput.bind(this, "group_short_description")}
          />
        </div>

        <div className="form-group">
          <label>
            Description
          </label>
          <textarea
            id="group_description"
            name="group_description"
            placeholder="Briefly describe your group..."
            rows="4"
            maxLength="300"
            className="form-control"
            value={this.state.formFields.group_description} onChange={this.form.onInput.bind(this, "group_description")}
          ></textarea>
          <div className="character-count">
            { (this.state.formFields.group_short_description || "").length} / 300
          </div>
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

export default GroupOverviewForm;
