// @flow

import React from "react";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import EditUserModal from "./EditUserModal.jsx";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { FormFieldValidator } from "../../utils/validation.js";
import _ from "lodash";

type Props = {|
  showModal: boolean,
  user: UserAPIData,
  onEditClose: UserAPIData => void,
|};
type State = {|
  showModal: boolean,
|};

type FormFields = {|
  first_name: string,
  last_name: string,
|};

/**
 * Modal for editing user name
 */
class EditUserNameModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      showModal: false,
      isProcessing: false,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    if (!this.state.showModal && nextProps.showModal) {
      const user: UserAPIData = nextProps.user;
      const formFieldsValues: FormFields = {
        first_name: user.first_name,
        last_name: user.last_name,
      };
      const validators: $ReadOnlyArray<FormFieldValidator<FormFields>> = [
        {
          fieldName: "first_name",
          checkFunc: (formFields: FormFields) =>
            !_.isEmpty(formFields.first_name),
          errorMessage: "Please enter First Name",
        },
        {
          fieldName: "last_name",
          checkFunc: (formFields: FormFields) =>
            !_.isEmpty(formFields.last_name),
          errorMessage: "Please enter Last Name",
        },
      ];

      UniversalDispatcher.dispatch({
        type: "SET_FORM_FIELDS",
        formFieldValues: formFieldsValues,
        validators: validators,
      });
    }
    return { showModal: nextProps.showModal };
  }

  render(): React$Node {
    return (
      <EditUserModal
        showModal={this.props.showModal}
        user={this.props.user}
        fields={["first_name", "last_name"]}
        onEditClose={this.props.onEditClose}
      >
        <TextFormField
          id="first_name"
          label="First Name (Required)"
          type={TextFormFieldType.SingleLine}
          required={true}
          maxLength={30}
        />
        <TextFormField
          id="last_name"
          label="Last Name (Required)"
          type={TextFormFieldType.SingleLine}
          required={true}
          maxLength={30}
        />
      </EditUserModal>
    );
  }
}

export default EditUserNameModal;
