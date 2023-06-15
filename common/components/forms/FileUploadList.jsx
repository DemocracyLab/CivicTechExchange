// @flow

import React from "react";
import { Container } from "flux/utils";
import type { FileUploadData } from "../common/upload/FileUploadButton.jsx";
import type { FileInfo } from "../common/FileInfo.jsx";
import Visibility from "../common/Visibility.jsx";
import FileUploadButton from "../common/upload/FileUploadButton.jsx";
import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import { deleteFromS3 } from "../utils/s3.js";
import GlyphStyles from "../utils/glyphs.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import FormFieldsStore from "../stores/FormFieldsStore.js";
import _ from "lodash";

type Props = {|
  files: ?Array<FileInfo>,
  elementid: string,
  title: ?string,
  subheader: ?string,
  singleFileOnly: ?boolean,
  useFormFieldsStore: ?boolean,
|};
type State = {|
  showDeleteModal: boolean,
  fileToDelete: FileInfo,
  files: Array<FileInfo>,
|};

/**
 * Allows uploading list of files
 */
class FileUploadList extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      files: FileUploadList.getFiles(props),
      title: "",
      showDeleteModal: false,
      fileToDelete: null,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.files = FileUploadList.getFiles(props);
    return state;
  }

  static getDerivedStateFromProps(nextProps: Props){
    if (nextProps.files) {
      let state: State = { files: FileUploadList.getFiles(nextProps),
      };
      this.pushFileUpdates();
      return state;
    }
    return null;
  }

  static getFiles(props: Props): Array<FileInfo> {
    const files: Array<FileInfo> = props.useFormFieldsStore
      ? FormFieldsStore.getFormFieldValue(props.elementid)
      : props.files;
    return files || [];
  }

  pushFileUpdates(): void {
    if (this.props.useFormFieldsStore) {
      UniversalDispatcher.dispatch({
        type: "UPDATE_FORM_FIELD",
        fieldName: this.props.elementid,
        fieldValue: this.state.files,
      });
    } else {
      const valueToSerialize: string = JSON.stringify(this.state.files);
      this.refs.hiddenFormField.value = valueToSerialize;
    }
  }

  askForDeleteConfirmation(fileToDelete: FileInfo): void {
    this.setState({
      fileToDelete: fileToDelete,
      showDeleteModal: true,
    });
  }

  confirmDelete(confirmed: boolean): void {
    if (confirmed) {
      _.remove(
        this.state.files,
        file =>
          file.publicUrl + file.id ===
          this.state.fileToDelete.publicUrl + this.state.fileToDelete.id
      );
      deleteFromS3(this.state.fileToDelete.key);
    }

    this.pushFileUpdates();

    this.setState({
      showDeleteModal: false,
      fileToDelete: null,
    });
    this.props.onChange && this.props.onChange();
  }

  handleFileSelection(fileUploadData: FileUploadData): void {
    let fileInfo = _.assign({ visibility: Visibility.PUBLIC }, fileUploadData);
    this.state.files.push(fileInfo);
    this.pushFileUpdates();
    this.forceUpdate();
    this.props.onChange && this.props.onChange();
  }

  render(): React$Node {
    return (
      <div>
        <input
          type="hidden"
          ref="hiddenFormField"
          id={this.props.elementid}
          name={this.props.elementid}
        />

        <h3>{this.props.title || "Files"}</h3>
        <p>{this.props.subheader}</p>
        <div className="form-offset">
          {this._renderUploadButton()}
          {this._renderFiles()}
        </div>

        <ConfirmationModal
          showModal={this.state.showDeleteModal}
          message="Do you want to delete this file?"
          onSelection={this.confirmDelete.bind(this)}
        />
      </div>
    );
  }

  _renderUploadButton(): ?React$Node {
    const hideButton: boolean =
      this.props.singleFileOnly &&
      this.state.files &&
      this.state.files.length > 0;

    return hideButton ? (
      <label>{this.props.title || "File"} &nbsp;</label>
    ) : (
      <FileUploadButton
        acceptedFileTypes="*"
        iconClass={GlyphStyles.Add}
        onFileUpload={this.handleFileSelection.bind(this)}
      />
    );
  }

  _renderFiles(): Array<React$Node> {
    return this.state.files.map((file, i) => (
      <div className="FileUploadList-item" key={i}>
        <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">
          {file.fileName}
        </a>
        <i
          className={GlyphStyles.Delete}
          aria-hidden="true"
          onClick={this.askForDeleteConfirmation.bind(this, file)}
        ></i>
      </div>
    ));
  }
}

export default Container.create(FileUploadList, { withProps: true });
