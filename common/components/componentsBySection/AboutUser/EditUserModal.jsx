// @flow

import React from "react";
import ModalWrapper from "../../common/ModalWrapper.jsx";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import ProjectAPIUtils from "../../utils/ProjectAPIUtils.js";
import { createDictionary, Dictionary } from "../../types/Generics.jsx";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import htmlDocument from "../../utils/htmlDocument.js";
import { Container } from "flux/utils";
import _ from "lodash";

type Props = {|
  showModal: boolean,
  user: UserAPIData,
  fields: $ReadOnlyArray<string>,
  fieldGetters: ?Dictionary<(any) => string>,
  onEditClose: UserAPIData => void,
  isInvalid: ?boolean,
|};
type State = {|
  showModal: boolean,
  isProcessing: boolean,
  isValid: boolean,
|};

/**
 * Modal for editing user profile fields
 */
class EditUserModal extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      isProcessing: false,
      isValid: !props.isInvalid,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.isValid = !props.isInvalid && FormFieldsStore.fieldsAreValid();
    return state;
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }

  close(user: ?UserAPIData): void {
    this.setState({ isProcessing: false }, () =>
      this.props.onEditClose(user || this.props.user)
    );
  }

  saveAndClose(editUserResponse: ?Response): void {
    if (editUserResponse) {
      editUserResponse
        .json()
        .then((updatedUser: UserAPIData) => this.close(updatedUser));
    } else {
      this.close(this.props.user);
    }
  }

  confirm(): void {
    const getFieldValue: string => string = (fieldName: string) => {
      if (this.props.fieldGetters && this.props.fieldGetters[fieldName]) {
        return this.props.fieldGetters[fieldName]();
      } else {
        let value: any = FormFieldsStore.getFormFieldValue(fieldName);
        return _.isObject(value) ? JSON.stringify(value) : value;
      }
    };

    this.setState({ isProcessing: true });
    const body: Dictionary<any> = createDictionary(
      this.props.fields,
      (fieldName: string) => fieldName,
      getFieldValue
    );
    const cookies: Dictionary<string> = htmlDocument.cookies();
    ProjectAPIUtils.post(
      `/api/user/edit/${this.props.user.id}/details/`,
      body,
      this.saveAndClose.bind(this),
      null,
      { "X-CSRFToken": cookies["csrftoken"] }
    );
  }

  render(): React$Node {
    const submitEnabled: boolean =
      !this.state.isProcessing && this.state.isValid;
    return (
      <ModalWrapper
        showModal={this.state.showModal}
        headerText="Edit Profile"
        cancelText="Cancel"
        cancelEnabled={!this.state.isProcessing}
        submitText={this.state.isProcessing ? "" : "Save"}
        submitEnabled={submitEnabled}
        onClickCancel={this.close.bind(this)}
        onClickSubmit={this.confirm.bind(this)}
      >
        {this.props.children}
      </ModalWrapper>
    );
  }
}

export default Container.create(EditUserModal, { withProps: true });
