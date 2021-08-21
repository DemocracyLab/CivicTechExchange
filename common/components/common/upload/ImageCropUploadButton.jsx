// @flow

import React from "react";
import type { S3Data } from "./S3Data.jsx";
import type { FileUploadData } from "./FileUploadButton";
import FileSelectButton from "./FileSelectButton.jsx";
import ReactCrop from "react-image-crop";
import type { FileInfo } from "../FileInfo.jsx";

type Props = {|
  onFileUpload: FileUploadData => void,
  buttonText: string,
  cropButtonText: string,
  acceptedFileTypes: string,
  iconClass: string,
  aspect: ?number,
  currentImage: FileInfo,
|};

type State = {|
  s3Key: string,
  croppedImageUrl: ?string,
|};

let lastFileUploadUrl: string = null;

class ImageCropUploadButton extends React.PureComponent<Props, State> {
  constructor(props): void {
    super(props);
    this.state = {
      s3Key: "",
      src: null,
      isCropping: false,
      croppedImageUrl: "",
      crop: this.initializeCropSettings(),
    };
  }

  render(): React$Node {
    const previewImage =
      this.state.croppedImageUrl ||
      (this.props.currentImage && this.props.currentImage.publicUrl);
    return (
      <div className="ImageCropUploadButton-root">
        {this.state.src && this.state.isCropping && (
          <div className="ImageCropUploadButton-cropper">
            <ReactCrop
              src={this.state.src}
              crop={this.state.crop}
              onImageLoaded={this._onImageLoaded.bind(this)}
              onComplete={this._onCropComplete.bind(this)}
              onChange={this._onCropChange.bind(this)}
            />
            <div className="ImageCropUploadButton-buttonGroup">
              <input
                type="button"
                value={this.props.cropButtonText || "Done Cropping"}
                onClick={this._handleDoneCropping.bind(this)}
              />
              <input
                type="button"
                value={this.props.cropCancelButtonText || "Cancel"}
                onClick={this._handleCancelCropping.bind(this)}
              />
            </div>
          </div>
        )}
        {!this.state.isCropping && (
          <FileSelectButton
            hasImagePreview="true"
            previewImage={previewImage}
            acceptedFileTypes="image/*"
            dragText={this.props.dragText || "Drag Your Image Here or"}
            buttonText={this.props.buttonText || "Browse Photos On Computer"}
            onFileSelect={this._handleFileSelection.bind(this)}
          />
        )}
      </div>
    );
  }

  _handleDoneCropping(): void {
    this.setState({ isCropping: false, crop: this.initializeCropSettings() });
    if (this.fileBlob) {
      this.launchPresignedUploadToS3(this.fileBlob);
    }
  }

  _handleCancelCropping(): void {
    if (lastFileUploadUrl) {
      this.setState({
        isCropping: false,
        crop: this.initializeCropSettings(),
        croppedImageUrl: lastFileUploadUrl,
      });
    } else {
      this.setState({
        isCropping: false,
        crop: this.initializeCropSettings(),
        croppedImageUrl: this.props.currentImage,
      });
    }
  }

  _onCropChange(crop): void {
    this.setState({ crop });
  }

  // If you setState the crop in here you should return false.
  _onImageLoaded(image): void {
    this.imageRef = image;
  }

  _onCropComplete(crop): void {
    this.makeClientCrop(crop);
  }

  _handleFileSelection(file): void {
    this.setState({ src: file, isCropping: true });
  }

  makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      ).then(croppedImageUrl => this.setState({ croppedImageUrl }));
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        this.fileBlob = blob;
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  launchPresignedUploadToS3(file: File): void {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `/presign_s3/upload/project/thumbnail?file_name=${file.name}&file_type=${file.type}`
    );
    var instance = this;

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          instance.uploadFileToS3(file, response.data, response.url);
        } else {
          alert("Could not get signed URL.");
        }
      }
    };
    xhr.send();
  }

  uploadFileToS3(file: File, s3Data: S3Data, url: string) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", s3Data.url);

    var postData = new FormData();
    for (var key in s3Data.fields) {
      postData.append(key, s3Data.fields[key]);
    }
    postData.append("file", file);
    this.state.s3Key = s3Data.fields.key;
    var instance = this;

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 204) {
          var fileUploadData = {
            key: instance.state.s3Key,
            fileName: file.name,
            publicUrl: url,
          };
          instance.props.onFileUpload(fileUploadData);
          lastFileUploadUrl = fileUploadData.publicUrl;
        } else {
          alert("Could not upload file.");
        }
      }
    };
    xhr.send(postData);
  }

  initializeCropSettings() {
    let cropSettings = {
      unit: "%",
      x: 5,
      y: 5,
      width: 90,
      height: 90,
    };
    cropSettings = this.props.aspect
      ? { ...cropSettings, aspect: this.props.aspect }
      : cropSettings;
    return cropSettings;
  }
}

export default ImageCropUploadButton;
