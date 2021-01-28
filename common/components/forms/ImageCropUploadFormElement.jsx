// @flow

import React from "react";
import ImageCropUploadButton from "../common/upload/ImageCropUploadButton.jsx";
import Visibility from "../common/Visibility.jsx";
import type FileUploadData from "../common/upload/ImageCropUploadButton.jsx";
import type { FileInfo } from "../common/FileInfo.jsx";
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

class ImageCropUploadFormElement extends React.PureComponent<Props, State> {
  constructor(): void {
    super();
    this.state = {
      currentImage: "",
      buttonText: "",
      initialized: false,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (!this.state.initialized && nextProps.currentImage) {
      this.updateFormFields(nextProps.currentImage);
      this.setState({ initialized: true });
    }
  }

  updateFormFields(fileInfo: FileInfo): void {
    this.refs.hiddenFormField.value = JSON.stringify(fileInfo);
    this.setState(
      { currentImage: fileInfo },
      () => this.props.onUpdate && this.props.onUpdate(fileInfo)
    );
    this.props.onSelection && this.props.onSelection(fileInfo);
  }

  render(): React$Node {
    const previewImage = this.props.currentImage
      ? this.props.currentImage.publicUrl
      : "";
    return (
      <div>
        <ImageCropUploadButton
          currentImage={previewImage}
          aspect={this.props.aspect}
          buttonText={this.props.buttonText || "Upload Image"}
          onFileUpload={this._handleFileSelection.bind(this)}
        />
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
    var fileInfo = _.assign({ visibility: Visibility.PUBLIC }, fileUploadData);
    this.updateFormFields(fileInfo);
  }
}

export default ImageCropUploadFormElement;
