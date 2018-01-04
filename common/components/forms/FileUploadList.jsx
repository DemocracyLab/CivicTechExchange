// @flow

import React from 'react';
import type { FileUploadData } from '../common/upload/FileUploadButton.jsx'
import type { FileInfo } from '../common/FileInfo.jsx'
import Visibility from '../common/Visibility.jsx'
import FileUploadButton from '../common/upload/FileUploadButton.jsx'
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx'
import { deleteFromS3 } from '../utils/s3.js'
import _ from 'lodash'

type Props = {|
  files: string,
  elementid: string
|};
type State = {|
  showDeleteModal: boolean,
  fileToDelete: LinkInfo,
  files: Array<LinkInfo>
|};

/**
 * Allows uploading list of files
 */
class FileUploadList extends React.PureComponent<Props,State>  {
  constructor(props: Props): void {
    super(props);
    this.state = {
      files: this.props.files ? JSON.parse(this.props.files) : [],
      showDeleteModal: false,
      fileToDelete: null
    };
  }
  
  updateLinkField(): void {
    this.refs.hiddenFormField.value = JSON.stringify(this.state.files);
  }
  
  askForDeleteConfirmation(fileToDelete: FileInfo): void {
    this.setState({
      fileToDelete: fileToDelete,
      showDeleteModal: true
    })
  }
  
  confirmDelete(confirmed: boolean): void {
    if(confirmed) {
      _.remove(this.state.files, (file) => file.publicUrl === this.state.fileToDelete.publicUrl);
      deleteFromS3(this.state.fileToDelete.key);
    }
  
    this.updateLinkField();
    
    this.setState({
      showDeleteModal: false,
      fileToDelete: null
    })
  }
  
  handleFileSelection(fileUploadData: FileUploadData): void {
    var fileInfo = _.assign({ visibility: Visibility.PUBLIC }, fileUploadData);
    this.state.files.push(fileInfo);
    this.updateLinkField();
    this.forceUpdate();
  }
  
  render(): React$Node {
    return (
      <div>
        <input type="hidden" ref="hiddenFormField" id={this.props.elementid} name={this.props.elementid}/>
        
        {this._renderFiles()}
        
        <FileUploadButton
          acceptedFileTypes="*"
          buttonText="Upload File"
          onFileUpload={this.handleFileSelection.bind(this)}
        />
        
        <ConfirmationModal
          showModal={this.state.showDeleteModal}
          message="Do you want to delete this file?"
          onSelection={this.confirmDelete.bind(this)}
        />
      </div>
    );
  }
  
  _renderFiles(): Array<React$Node> {
    return this.state.files.map((file,i) =>
      <div key={i}>
        <a href={file.publicUrl}>{file.fileName}</a>
        <i className="fa fa-trash-o fa-1" aria-hidden="true" onClick={this.askForDeleteConfirmation.bind(this,file)}></i>
      </div>
    );
  }
}

export default FileUploadList;