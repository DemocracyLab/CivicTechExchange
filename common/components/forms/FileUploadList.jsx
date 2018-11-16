// @flow

import React from 'react';
import type { FileUploadData } from '../common/upload/FileUploadButton.jsx'
import type { FileInfo } from '../common/FileInfo.jsx'
import Visibility from '../common/Visibility.jsx'
import FileUploadButton from '../common/upload/FileUploadButton.jsx'
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx'
import { deleteFromS3 } from '../utils/s3.js'
import _ from 'lodash'
import GlyphStyles from "../utils/glyphs";

type Props = {|
  files: Array<FileInfo>,
  elementid: string,
  title: ?string,
  singleFileOnly: ?boolean
|};
type State = {|
  showDeleteModal: boolean,
  fileToDelete: FileInfo,
  files: Array<FileInfo>
|};

/**
 * Allows uploading list of files
 */
class FileUploadList extends React.PureComponent<Props,State>  {
  constructor(props: Props): void {
    super(props);
    this.state = {
      files: this.props.files || [],
      title: "",
      showDeleteModal: false,
      fileToDelete: null
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.files) {
      this.setState({files: nextProps.files || []});
      this.updateHiddenField();
    }
  }

  updateHiddenField(): void {
    // Serialize as a single value instead of array if this is a single-select list
    const valueToSerialize: string = JSON.stringify(this.props.singleFileOnly && this.state.files.length > 0 ? this.state.files[0] : this.state.files);

    this.refs.hiddenFormField.value = valueToSerialize;
  }

  askForDeleteConfirmation(fileToDelete: FileInfo): void {
    this.setState({
      fileToDelete: fileToDelete,
      showDeleteModal: true
    })
  }

  confirmDelete(confirmed: boolean): void {
    if(confirmed) {
      _.remove(this.state.files, (file) => file.publicUrl + file.id === this.state.fileToDelete.publicUrl + this.state.fileToDelete.id);
      deleteFromS3(this.state.fileToDelete.key);
    }

    this.updateHiddenField();

    this.setState({
      showDeleteModal: false,
      fileToDelete: null
    })
  }

  handleFileSelection(fileUploadData: FileUploadData): void {
    var fileInfo = _.assign({ visibility: Visibility.PUBLIC }, fileUploadData);
    this.state.files.push(fileInfo);
    this.updateHiddenField();
    this.forceUpdate();
  }

  render(): React$Node {
    return (
      <div>
        <input type="hidden" ref="hiddenFormField" id={this.props.elementid} name={this.props.elementid}/>

        {this._renderUploadButton()}

        {this._renderFiles()}

        <ConfirmationModal
          showModal={this.state.showDeleteModal}
          message="Do you want to delete this file?"
          onSelection={this.confirmDelete.bind(this)}
        />
      </div>
    );
  }

  _renderUploadButton(): ?React$Node {
    const hideButton: boolean = this.props.singleFileOnly && this.state.files && this.state.files.length > 0;

    return hideButton ? <label>{this.props.title || "File"} &nbsp;</label> : (
      <FileUploadButton
        className="btn-background-project"
        acceptedFileTypes="*"
        buttonText={this.props.title || "Files"}
        iconClass={GlyphStyles.Add}
        onFileUpload={this.handleFileSelection.bind(this)}
      />
    );
  }

  _renderFiles(): Array<React$Node> {
    return this.state.files.map((file,i) =>
      <div key={i}>
        <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
        <i className={GlyphStyles.Delete} aria-hidden="true" onClick={this.askForDeleteConfirmation.bind(this,file)}></i>
      </div>
    );
  }
}

export default FileUploadList;
