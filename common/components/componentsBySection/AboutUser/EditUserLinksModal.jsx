// @flow

import React from "react";
import { Container } from "flux/utils";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import EditUserModal from "./EditUserModal.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { LinkTypes } from "../../constants/LinkConstants";
import LinkList, {
  NewLinkInfo,
  compileLinkFormFields,
} from "../../forms/LinkList.jsx";
import _ from "lodash";
import FormFieldsStore from "../../stores/FormFieldsStore.js";

type Props = {|
  showModal: boolean,
  user: UserAPIData,
  onEditClose: UserAPIData => void,
|};
type State = {|
  showModal: boolean,
  linkList: any,
  links: $ReadOnlyArray<NewLinkInfo>,
  isValid: boolean,
|};

/**
 * Modal for editing user name
 */
class EditUserBioModal extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      showModal: false,
      isProcessing: false,
    };
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    const formFields = FormFieldsStore.getFormFieldValues();
    if (formFields) {
      state.links = compileLinkFormFields(
        props.user.user_links,
        _.omit(formFields, ["user_links"])
      );
      state.isValid = FormFieldsStore.fieldsAreValid();
    }
    return state;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (!this.state.showModal && nextProps.showModal) {
      const user: UserAPIData = nextProps.user;

      UniversalDispatcher.dispatch({
        type: "SET_FORM_FIELDS",
        formFieldValues: { user_links: user.user_links },
        validators: [],
      });
    }
    this.setState({ showModal: nextProps.showModal });
  }

  _serializeLinks(): string {
    return JSON.stringify(this.state.links || []);
  }

  render(): React$Node {
    return (
      <EditUserModal
        showModal={this.props.showModal}
        user={this.props.user}
        fields={["user_links"]}
        fieldGetters={{ user_links: () => this._serializeLinks() }}
        onEditClose={this.props.onEditClose}
        isInvalid={!_.isEmpty(this.state.linkErrors)}
      >
        <div className="create-form-block">
          <LinkList
            title="Links"
            subheader=""
            linkOrdering={[LinkTypes.LINKED_IN]}
            addLinkText="Add a new link"
            links={this.props.user.user_links}
          />
        </div>
      </EditUserModal>
    );
  }
}

export default Container.create(EditUserBioModal, { withProps: true });
