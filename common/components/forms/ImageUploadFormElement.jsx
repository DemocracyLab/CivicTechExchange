// @flow

import React from 'react';
import FileUploadButton from '../common/upload/FileUploadButton.jsx'
import type FileUploadData from '../common/upload/FileUploadButton.jsx'

type Props = {|
  form_id: string
|};

type State = {|
  imagePreviewUrl: string,
|};


class ImageUploadFormElement extends React.PureComponent<Props,State> {

  constructor(): void {
    super();
    this.state = {
      imagePreviewUrl: ""
    };
  }

  render(): React$Node {
    return (
      <div>
        {
          this.state.imagePreviewUrl
          ? this._renderThumbnail()
          : this._renderThumbnailPlaceholder()
        }
        <FileUploadButton acceptedFileTypes="image/*" buttonText="Upload Project Image" onFileUpload={this._handleFileSelection.bind(this)}/>
        <input type="hidden" ref="hiddenFormField" name={this.props.form_id} id={this.props.form_id} />
      </div>
    );
  }
  
  _renderThumbnailPlaceholder() : React$Node {
    return (
      <span ref="thumbnailPlaceholder" className="upload_img upload_img_bdr">
          <i className="fa fa-folder-open-o fa-3x" aria-hidden="true"></i>
      </span>
    );
  }
  
  _renderThumbnail() : React$Node {
    return (
      <img className="upload_img upload_img_bdr" src={this.state.imagePreviewUrl}/>
    );
  }
  
  _handleFileSelection(fileUploadData: FileUploadData) : void {
    this.refs.hiddenFormField.value = fileUploadData.key;
    this.setState({"imagePreviewUrl": fileUploadData.publicUrl});
  }

}

export default ImageUploadFormElement;
