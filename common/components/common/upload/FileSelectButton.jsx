// @flow

import React from 'react';
import Button from 'react-bootstrap/Button';
import FileDrop from 'react-file-drop';

type Props = {|
  onFileSelect: (image) => void,
  buttonText: string,
  dragText: string,
  acceptedFileTypes: string,
  iconClass: string,
  hasImagePreview : boolean,
  previewImage : string
|};


class FileSelectButton extends React.PureComponent<Props, State> {

  constructor(): void {
    super();
    this.state = {
    };
  }

  render(): React$Node {
      const previewImageStyle = {
        backgroundImage: 'url(' + this.props.previewImage + ')',
    };

    return (
      <FileDrop onDrop={this._handleDrop.bind(this)} className={this.props.hasImagePreview ? "FileSelectButton-wrapper FileSelectButton-imagePreview" : "FileSelectButton-wrapper"}>
        <div className="FileSelectButton-innerWrapper" style={previewImageStyle} >
        <div className="FileSelectionButton-dragTargetArea"></div>
          <div className="FileSelectButton-innerContent">
            <div className="FileSelectButton-dragFiles">{this.props.dragText || "Drag Your Files Here or"}</div>
            <div className="FileSelectButton-button">
              <input type="button" value={this.props.buttonText || "Browse Photos On Computer"} onClick={this._handleClick.bind(this)} className="btn btn-primary"/>
              <input ref="fileInput" type="file" style={{display:"none"}} accept={this.props.acceptedFileTypes} onChange={this._handleFileSelection.bind(this)} />
            </div>
          </div>
        </div>
      </FileDrop>
    );
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
  }

}

export default FileSelectButton;
