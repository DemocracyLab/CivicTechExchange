// @flow

import React from "react";
import type {FileInfo} from "../../common/FileInfo.jsx";
import ImageCropUploadFormElement from "../../../components/forms/ImageCropUploadFormElement.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {TagDefinition, GroupDetailsAPIData} from "../../../components/utils/GroupAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import {Locations} from "../../constants/ProjectConstants.js";
import _ from "lodash";
// Todo: Wrap this in proper state management
import { projectSelectionStoreSingleton } from '../../controllers/CreateGroupController.jsx'


type FormFields = {|
  group_name: ?string,
  group_location: ?string,
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
      group_location: group ? group.group_location : "",
      group_thumbnail: group ? group.group_thumbnail : "",
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
          <label htmlFor="group_location">Location</label>
          <select
            name="group_location"
            id="group_location"
            className="form-control"
            value={this.state.formFields.group_location}
            onChange={this.form.onInput.bind(this, "group_location")}>
            {!_.includes(Locations.PRESET_LOCATIONS, this.state.formFields.group_location) ? <option value={this.state.formFields.group_location}>{this.state.formFields.project_location}</option> : null}
            {Locations.PRESET_LOCATIONS.map(location => <option key={location} value={location}>{location}</option>)}
          </select>
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
