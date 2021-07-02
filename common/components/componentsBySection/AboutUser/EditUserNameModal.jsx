// @flow

import React from "react";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import EditUserModal from "./EditUserModal.jsx";
import TextFormField from "../../forms/fields/TextFormField.jsx";
import type { Validator } from "../../forms/FormValidation.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
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
    const user: UserAPIData = props.user;
    const formFieldsValues: FormFields = {
      first_name: user.first_name,
      last_name: user.last_name,
    };
    const validators: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields.first_name),
        errorMessage: "Please enter First Name",
      },
      {
        checkFunc: (formFields: FormFields) => !_.isEmpty(formFields.last_name),
        errorMessage: "Please enter Last Name",
      },
    ];

    UniversalDispatcher.dispatch({
      type: "SET_FORM_FIELDS",
      formFieldValues: formFieldsValues,
      validators: validators,
    });

    this.state = {
      showModal: false,
      isProcessing: false,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
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
          required={true}
        />
        <TextFormField
          id="last_name"
          label="Last Name (Required)"
          required={true}
        />
      </EditUserModal>
    );
  }
}

export default EditUserNameModal;
