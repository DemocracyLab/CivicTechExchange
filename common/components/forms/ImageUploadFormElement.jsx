// @flow

import React from 'react';
import FileUploadButton from '../common/upload/FileUploadButton.jsx'
import Visibility from '../common/Visibility.jsx'
import type FileUploadData from '../common/upload/FileUploadButton.jsx'
import type {FileInfo} from '../common/FileInfo.jsx'
import _ from 'lodash'

type Props = {|
  form_id: string,
  buttonText: ?string,
  currentImage: FileInfo
|};

type State = {|
  currentImage: FileInfo,
  initialized: boolean
|};


class ImageUploadFormElement extends React.PureComponent<Props,State> {

  constructor(): void {
    super();
    this.state = {
      currentImage: "",
      buttonText: "",
      initialized: false
    };
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(!this.state.initialized && nextProps.currentImage) {
      this.updateFormFields(nextProps.currentImage);
      this.setState({initialized: true});
    }
  }
  
  updateFormFields(fileInfo: FileInfo): void {
    this.refs.hiddenFormField.value = JSON.stringify(fileInfo);
    this.setState({"currentImage": fileInfo});
  }

  render(): React$Node {
    return (
      <div>
        {this.state.currentImage && this._renderThumbnail()}
        <FileUploadButton acceptedFileTypes="image/*" buttonText={this.props.buttonText || "Upload Image"} onFileUpload={this._handleFileSelection.bind(this)}/>
        <input type="hidden" ref="hiddenFormField" name={this.props.form_id} id={this.props.form_id} />
      </div>
    );
  }
  
  _renderThumbnail() : React$Node {
    return (
      <img className="upload_img upload_img_bdr" src={this.state.currentImage.publicUrl}/>
    );
  }
  
  _handleFileSelection(fileUploadData: FileUploadData) : void {
    var fileInfo = _.assign({ visibility: Visibility.PUBLIC }, fileUploadData);
    this.updateFormFields(fileInfo);
  }

}

export default ImageUploadFormElement;
