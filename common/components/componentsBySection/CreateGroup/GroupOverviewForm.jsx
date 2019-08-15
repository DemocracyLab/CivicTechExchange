// @flow

import React from "react";
import type {FileInfo} from "../../common/FileInfo.jsx";
import ImageUploadFormElement from "../../../components/forms/ImageUploadFormElement.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import TagSelector from "../../common/tags/TagSelector.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {TagDefinition, GroupDetailsAPIData} from "../../../components/utils/GroupAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";


type FormFields = {|
  group_name: ?string,
  group_short_description: ?string,
  group_issue_area?: Array<TagDefinition>,
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
    const group: GroupDetailsAPIData = props.group;
    const formFields: FormFields = {
      group_name: group ? group.group_name : "",
      group_short_description: group ? group.group_short_description : "",
      group_issue_area: group ? group.group_issue_area : [],
      group_thumbnail: group ? group.group_thumbnail : ""
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["group_name"]),
        errorMessage: "Please enter group Name"
      },
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields["group_short_description"]),
        errorMessage: "Please enter group Description"
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
      <div className="EditGroupForm-root">

        <DjangoCSRFToken/>

        <div className="form-group">
          <ImageUploadFormElement form_id="group_thumbnail_location"
                                  buttonText="Upload Group Image"
                                  currentImage={this.state.formFields.group_thumbnail}
                                  onSelection={this.form.onSelection.bind(this, "group_thumbnail")}
          />
        </div>

        <div className="form-group">
          <label>Group Name</label>
          <input type="text" className="form-control" id="group_name" name="group_name" maxLength="60"
                 value={this.state.formFields.group_name} onChange={this.form.onInput.bind(this, "group_name")}/>
        </div>

        <div className="form-group">
          <label>Issue Area</label>
          <TagSelector
            elementId="group_issue_area"
            value={this.state.formFields.group_issue_area}
            category={TagCategory.ISSUES}
            allowMultiSelect={false}
            onSelection={this.form.onSelection.bind(this, "group_issue_area")}
          />
        </div>
  
        <div className="form-group">
          <label>
            Short Description
          </label>
          <div className="character-count">
            { (this.state.formFields.group_short_description || "").length} / 140
          </div>
          <textarea className="form-control" id="group_short_description" name="group_short_description"
                    placeholder="Give a one-sentence description of this group" rows="2" maxLength="140"
                    value={this.state.formFields.group_short_description} onChange={this.form.onInput.bind(this, "group_short_description")}></textarea>
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
