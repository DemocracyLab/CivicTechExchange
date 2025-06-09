// @flow

import React from "react";
import ImageCropUploadButton from "../common/upload/ImageCropUploadButton.jsx";
import Visibility from "../common/Visibility.jsx";
import type FileUploadData from "../common/upload/ImageCropUploadButton.jsx";
import type { FileInfo } from "../common/FileInfo.jsx";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import { Container } from "flux/utils";
import FormFieldsStore from "../stores/FormFieldsStore.js";
import _ from "lodash";

type Props = {|
  form_id: string,
  buttonText: ?string,
  currentImage: FileInfo,
  onSelection: ?(FileInfo) => void,
  aspect: number,
|};

type State = {|
  currentImage: FileInfo,
  initialized: boolean,
|};

class ImageCropUploadFormElement extends React.Component<Props, State> {
  constructor(): void {
    super();
    this.state = {
      currentImage: "",
      buttonText: "",
      initialized: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (!this.state.initialized && nextProps.currentImage) {
      this.updateFormFields(nextProps.currentImage);
      this.setState({ initialized: true });
    }
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.currentImage = FormFieldsStore.getFormFieldValue(props.form_id);
    return state;
  }

  updateFormFields(fileInfo: FileInfo): void {
    this.refs.hiddenFormField.value = JSON.stringify(fileInfo);
    this.setState(
      { currentImage: fileInfo },
      () => this.props.onUpdate && this.props.onUpdate(fileInfo)
    );
    UniversalDispatcher.dispatch({
      type: "UPDATE_FORM_FIELD",
      fieldName: this.props.form_id,
      fieldValue: fileInfo,
    });
    // TODO: Need this?
    this.props.onSelection && this.props.onSelection(fileInfo);
  }

  render(): React$Node {
    return (
      <div>
        <ImageCropUploadButton
          currentImage={this.state.currentImage}
          aspect={this.props.aspect}
          buttonText={this.props.buttonText || "Upload Image"}
          onFileUpload={this._handleFileSelection.bind(this)}
        />
        {/*TODO: Use HiddenFormField component*/}
        <input
          type="hidden"
          ref="hiddenFormField"
          name={this.props.form_id}
          id={this.props.form_id}
        />
      </div>
    );
  }

  _handleFileSelection(fileUploadData: FileUploadData): void {
    const fileInfo: FileInfo = _.assign(
      { visibility: Visibility.PUBLIC },
      fileUploadData
    );
    this.updateFormFields(fileInfo);
  }
}

export default Container.create(ImageCropUploadFormElement, {
  withProps: true,
});
