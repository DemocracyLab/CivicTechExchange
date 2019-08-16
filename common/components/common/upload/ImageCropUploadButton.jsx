// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type { S3Data } from './S3Data.jsx'
import FileSelectButton from './FileSelectButton.jsx';
import ReactCrop from "react-image-crop";

export type FileUploadData = {|
  key: string,
  fileName: string,
  publicUrl: string
|};

type Props = {|
  onFileUpload: (FileUploadData) => void,
  buttonText: string,
  acceptedFileTypes: string,
  iconClass: string
|};

type State = {|
  s3Key: string,
|};

class ImageCropUploadButton extends React.PureComponent<Props, State> {

  constructor(): void {
    super();
    this.state = {
      s3Key: "",
      src: null,
      isCropping: false,
      crop: {
        unit: "%",
        width: 30,
        aspect: 16 / 9
      }
    };
  }

  render(): React$Node {
      return (
        <div>
        {this.state.src && this.state.isCropping && (
          <div>
          <ReactCrop
            // renderComponent={this.renderVideo()}
            src={this.state.src}
            crop={this.state.crop}
            // ruleOfThirds
            // circularCrop
            onImageLoaded={this.onImageLoaded.bind(this)}
            onComplete={this.onCropComplete.bind(this)}
            onChange={this.onCropChange.bind(this)}
         //   onDragStart={this.onDragStart}
           // onDragEnd={this.onDragEnd}
            // renderSelectionAddon={this.renderSelectionAddon}
            // minWidth={160}
            // minHeight={90}
          />
            <input type="button" value="Done Cropping" onClick={this._handleDoneCropping.bind(this)} className="crop-img-btn"/>
</div>
        )}
        {this.state.croppedImageUrl && !this.state.isCropping && (
          <img alt="Crop" style={{ maxWidth: "100%" }} src={this.state.croppedImageUrl} />
        )}
        {!this.state.isCropping && (
          <FileSelectButton acceptedFileTypes="image/*" buttonText={this.props.buttonText || "Upload Image"} onFileSelect={this._handleFileSelection.bind(this)}/>
        )}
        </div>
      );
  }

  _handleDoneCropping() : void {
     this.setState( { isCropping: false } );
  }

  onCropChange(crop, percentCrop) : void {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  // If you setState the crop in here you should return false.
  onImageLoaded(image) : void {
    this.imageRef = image;
  };

  onCropComplete(crop) : void {
    this.makeClientCrop(crop);
  };

  _handleClick(): void {
    this.refs.fileInput.click();
  }

  _handleFileSelection(file): void {
    this.setState( { src: file, isCropping: true } );
    console.log(file);
    //this.launchPresignedUploadToS3(this.refs.fileInput.files[0]);
  }

  makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      ).then((croppedImageUrl) => this.setState({ croppedImageUrl }));
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

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  launchPresignedUploadToS3(file: File): void {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/presign_s3/upload/project/thumbnail?file_name=${file.name}&file_type=${file.type}`);
    var instance = this;

    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          var response = JSON.parse(xhr.responseText);
          instance.uploadFileToS3(file, response.data, response.url);
        }
        else{
          alert("Could not get signed URL.");
        }
      }
    };
    xhr.send();
  }

  uploadFileToS3(file: File, s3Data: S3Data, url: string){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", s3Data.url);

    var postData = new FormData();
    for(var key in s3Data.fields){
      postData.append(key, s3Data.fields[key]);
    }
    postData.append('file', file);
    this.state.s3Key = s3Data.fields.key;
    var instance = this;

    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4){
        if(xhr.status === 200 || xhr.status === 204){
          var fileUploadData = {
            key: instance.state.s3Key,
            fileName: file.name,
            publicUrl: url
          };
          instance.props.onFileUpload(fileUploadData);
        }
        else{
          alert("Could not upload file.");
        }
      }
    };
    xhr.send(postData);
  }

}

export default ImageCropUploadButton;
