// @flow

import React from "react";
import type { FileInfo } from "../../common/FileInfo.jsx";
import ImageCropUploadFormElement from "../../../components/forms/ImageCropUploadFormElement.jsx";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type { Validator } from "../../forms/FormValidation.jsx";
import type { GroupDetailsAPIData } from "../../utils/GroupAPIUtils.js";
import form, { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import { CountryData, countryByCode } from "../../constants/Countries.js";
import { LocationFormInputsByEntity } from "../../forms/LocationAutocompleteForm.jsx";
import {
  LocationInfo,
  getLocationInfoFromGroup,
} from "../../common/location/LocationInfo.js";
import _ from "lodash";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";
import CountryLocationFormFields from "../../forms/fields/CountryLocationFormFields.jsx";
import CheckBox from "../../common/selection/CheckBox.jsx";
import CurrentUser from "../../utils/CurrentUser.js";

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
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Group Overview section
 */
class GroupOverviewForm extends React.PureComponent<Props, State> {
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
      group_slug: group ? group.group_slug : "",
      is_private: !!group?.is_private,
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        fieldName: "group_name",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["group_name"]),
        errorMessage: "Please enter Group Name",
      },
      {
        fieldName: "group_short_description",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["group_short_description"]),
        errorMessage: "Please enter a one-sentence description",
      },
      {
        fieldName: "group_description",
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["group_description"]),
        errorMessage: "Please enter Group Description",
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
    };
    props.readyForSubmit(formIsValid);
  }

  render(): React$Node {
    return (
      <div className="EditGroupForm-root">
        <DjangoCSRFToken />

        <div className="form-group">
          <ImageCropUploadFormElement
            form_id="group_thumbnail"
            buttonText="Upload Group Image"
          />
        </div>

        <TextFormField
          id="group_name"
          label="Group Name"
          type={TextFormFieldType.SingleLine}
          required={true}
          maxLength={60}
        />

        <CountryLocationFormFields
          countryFieldId="group_country"
          locationFieldId="group_location"
          locationFormInputs={LocationFormInputsByEntity.Groups}
        />

        <TextFormField
          id="group_short_description"
          label="Short Description"
          type={TextFormFieldType.MultiLine}
          rows={2}
          placeholder="Group Description"
          required={true}
          showCount={true}
          maxLength={140}
        />

        <TextFormField
          id="group_description"
          label="Description"
          type={TextFormFieldType.MultiLine}
          rows={4}
          placeholder="Briefly describe your group..."
          required={true}
          showCount={true}
          maxLength={3000}
        />

        {CurrentUser.isStaff(this.props.group) && this._renderAdminControls()}
      </div>
    );
  }

  _renderAdminControls(): React$Node {
    return (
      <React.Fragment>
        <TextFormField
          id="group_slug"
          label="Group Url Slug"
          type={TextFormFieldType.SingleLine}
          required={false}
          maxLength={60}
        />

        <CheckBox id="is_private" label="Private Group" />
      </React.Fragment>
    );
  }
}

export default GroupOverviewForm;
