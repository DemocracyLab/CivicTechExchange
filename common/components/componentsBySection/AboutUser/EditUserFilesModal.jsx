// @flow

import React from "react";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import EditUserModal from "./EditUserModal.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import FileUploadList from "../../forms/FileUploadList.jsx";
import { FileInfo } from "../../common/FileInfo.jsx";

type Props = {|
  showModal: boolean,
  user: UserAPIData,
  onEditClose: UserAPIData => void,
|};
type State = {|
  showModal: boolean,
|};

type FormFields = {|
  user_files: string,
|};

const UserFileTypes = {
  RESUME: "RESUME",
};

/**
 * Modal for editing user files
 */
class EditUserFilesModal extends React.PureComponent<Props, State> {
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
        user_resume_file: user.user_files.filter(
          (file: FileInfo) => file.fileCategory === UserFileTypes.RESUME
        ),
        user_files: user.user_files.filter(
          (file: FileInfo) => file.fileCategory !== UserFileTypes.RESUME
        ),
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
        fields={["user_resume_file", "user_files"]}
        onEditClose={this.props.onEditClose}
      >
        <div className="form-group create-form-block">
          <FileUploadList
            elementid="user_resume_file"
            title="Upload Resume"
            singleFileOnly={true}
            useFormFieldsStore={true}
          />
        </div>

        <div className="form-group create-form-block">
          <FileUploadList
            elementid="user_files"
            title="Other Files"
            useFormFieldsStore={true}
          />
        </div>
      </EditUserModal>
    );
  }
}

export default EditUserFilesModal;
