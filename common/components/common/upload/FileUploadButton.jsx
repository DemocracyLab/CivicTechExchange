// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import type { S3Data } from './S3Data.jsx'

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

class FileUploadButton extends React.PureComponent<Props, State> {

  constructor(): void {
    super();
    this.state = {
      s3Key: ""
    };
  }

  render(): React$Node {
    if(this.props.iconClass && this.props.buttonText){
      return (
        <div>
          <input ref="fileInput" type="file" style={{display:"none"}} accept={this.props.acceptedFileTypes} onChange={this._handleFileSelection.bind(this)} />

          <label>{this.props.buttonText} &nbsp;</label>
          <Button
            className="btn-background-project"
            bsSize="small"
            onClick={this._handleClick.bind(this)}
          >
            <i className={this.props.iconClass} aria-hidden="true"></i>
          </Button>
        </div>
      );
    } else if (this.props.buttonText){
      return (
        <div>
          <input type="button" value={this.props.buttonText} onClick={this._handleClick.bind(this)} className="upload-img-btn"/>
          <input ref="fileInput" type="file" style={{display:"none"}} accept={this.props.acceptedFileTypes} onChange={this._handleFileSelection.bind(this)} />
        </div>
      );
    }
  }

  _handleClick(): void {
    this.refs.fileInput.click();
  }

  _handleFileSelection(): void {
    this.launchPresignedUploadToS3(this.refs.fileInput.files[0]);
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

export default FileUploadButton;
