// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import FileDrop from 'react-file-drop';

type Props = {|
  onFileSelect: (image) => void,
  buttonText: string,
  acceptedFileTypes: string,
  iconClass: string
|};


class FileSelectButton extends React.PureComponent<Props, State> {

  constructor(): void {
    super();
    this.state = {
    };
  }

  render(): React$Node {
    if(this.props.iconClass && this.props.buttonText){
      return (
                <FileDrop onDrop={this._handleDrop.bind(this)}>
          Drop some files here!
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
        </FileDrop>
      );
    } else if (this.props.buttonText){
      return (
                <FileDrop onDrop={this._handleDrop.bind(this)}>
          Drop some files here!
        <div>
          <input type="button" value={this.props.buttonText} onClick={this._handleClick.bind(this)} className="upload-img-btn"/>
          <input ref="fileInput" type="file" style={{display:"none"}} accept={this.props.acceptedFileTypes} onChange={this._handleFileSelection.bind(this)} />
        </div>
        </FileDrop>
      );
    }
  }

   _processFile(file) : void {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
        this.props.onFileSelect(reader.result);
      });
      reader.readAsDataURL(file);
    
  };

  _isValidFileType(file) : boolean {
    // TODO check against this.props.acceptedFileTypes
      return file.type && file.type.startsWith('image/');
  }

  _handleDrop(files, event) : void {
    if (this._isValidFileType(files[0])) {
      this._processFile(files[0]);
    }
  }

  _handleClick(): void {
    this.refs.fileInput.click();
  }

  _handleFileSelection(): void {
    this._processFile(this.refs.fileInput.files[0]);
    //this.launchPresignedUploadToS3(this.refs.fileInput.files[0]);
  }

}

export default FileSelectButton;
