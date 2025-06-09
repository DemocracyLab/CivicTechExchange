// @flow

import React from "react";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import EditUserModal from "./EditUserModal.jsx";
import TextFormField, {
  TextFormFieldType,
} from "../../forms/fields/TextFormField.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";

type Props = {|
  showModal: boolean,
  user: UserAPIData,
  onEditClose: UserAPIData => void,
|};
type State = {|
  showModal: boolean,
|};

type FormFields = {|
  about_me: string,
|};

/**
 * Modal for editing user name
 */
class EditUserBioModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      showModal: false,
      isProcessing: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (!this.state.showModal && nextProps.showModal) {
      const user: UserAPIData = nextProps.user;
      const formFieldsValues: FormFields = {
        about_me: user.about_me,
      };

      UniversalDispatcher.dispatch({
        type: "SET_FORM_FIELDS",
        formFieldValues: formFieldsValues,
      });
    }
    this.setState({ showModal: nextProps.showModal });
  }

  render(): React$Node {
    return (
      <EditUserModal
        showModal={this.props.showModal}
        user={this.props.user}
        fields={["about_me"]}
        onEditClose={this.props.onEditClose}
      >
        <TextFormField
          id="about_me"
          type={TextFormFieldType.MultiLine}
          label="Bio"
          maxLength={2000}
          rows={6}
          showCount={true}
        />
      </EditUserModal>
    );
  }
}

export default EditUserBioModal;
