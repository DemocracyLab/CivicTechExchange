// @flow

import React from "react";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import EditUserModal from "./EditUserModal.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { FileInfo } from "../../common/FileInfo.jsx";
import ImageCropUploadButton from "../../common/upload/ImageCropUploadButton.jsx";
import { Container } from "flux/utils";
import type { FileUploadData } from "../../common/upload/FileUploadButton";
import FormFieldsStore from "../../stores/FormFieldsStore";
import Visibility from "../../common/Visibility.jsx";
import _ from "lodash";

type Props = {|
  showModal: boolean,
  user: UserAPIData,
  onEditClose: UserAPIData => void,
|};
type State = {|
  showModal: boolean,
  user_thumbnail: FileInfo,
|};

type FormFields = {|
  user_thumbnail: FileInfo,
|};

/**
 * Modal for editing user thumbnail
 */
class EditUserThumbnailModal extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      showModal: false,
      user_thumbnail: null,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State): State {
    let state: State = _.clone(prevState) || {};
    state.user_thumbnail = FormFieldsStore.getFormFieldValue("user_thumbnail");
    return state;
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (!this.state.showModal && nextProps.showModal) {
      const user: UserAPIData = nextProps.user;
      const formFieldsValues: FormFields = {
        user_thumbnail: user.user_thumbnail,
      };

      UniversalDispatcher.dispatch({
        type: "SET_FORM_FIELDS",
        formFieldValues: formFieldsValues,
      });
    }
    this.setState({ showModal: nextProps.showModal });
  }

  onSaveThumbnail(fileData: FileUploadData): void {
    fileData.visibility = Visibility.PUBLIC;
    UniversalDispatcher.dispatch({
      type: "UPDATE_FORM_FIELD",
      fieldName: "user_thumbnail",
      fieldValue: fileData,
    });
  }

  render(): React$Node {
    return (
      <EditUserModal
        showModal={this.props.showModal}
        user={this.props.user}
        fields={["user_thumbnail"]}
        onEditClose={this.props.onEditClose}
      >
        <ImageCropUploadButton
          currentImage={this.state.user_thumbnail}
          aspect={1 / 1}
          buttonText={"Upload Your Picture"}
          onFileUpload={this.onSaveThumbnail.bind(this)}
        />
      </EditUserModal>
    );
  }
}

export default Container.create(EditUserThumbnailModal);
