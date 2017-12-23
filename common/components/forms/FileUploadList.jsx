// @flow

import React from 'react';
import type { FileUploadData } from '../common/upload/FileUploadButton.jsx'
import FileUploadButton from '../common/upload/FileUploadButton.jsx'
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx'
import { deleteFromS3 } from '../utils/s3.js'
import _ from 'lodash'

type FileInfo = {|
  s3Key: string,
  name: string,
  type: string,
  fileUrl: string
|};

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
      _.remove(this.state.files, (file) => file.fileUrl === this.state.fileToDelete.fileUrl);
      deleteFromS3(this.state.fileToDelete.s3Key);
    }
    
    this.setState({
      showDeleteModal: false,
      fileToDelete: null
    })
  }
  
  handleFileSelection(fileUploadData: FileUploadData): void {
    var fileInfo = {
      s3Key: fileUploadData.key,
      name: fileUploadData.fileName,
      type: fileUploadData.fileName.split(".")[-1],
      fileUrl: fileUploadData.publicUrl
    }
    this.state.files.push(fileInfo);
    this.updateLinkField();
    this.forceUpdate();
  }
  
  render(): React$Node {
    return (
      <div>
        <input type="hidden" ref="hiddenFormField" id={this.props.elementid} value={this.state.files}/>
        
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
        <a href={file.fileUrl}>{file.name}</a>
        <i class="fa fa-trash-o fa-1" aria-hidden="true" onClick={this.askForDeleteConfirmation.bind(this,file)}></i>
      </div>
    );
  }
}

export default FileUploadList;