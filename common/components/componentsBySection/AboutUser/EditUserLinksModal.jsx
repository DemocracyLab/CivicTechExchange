// @flow

import React from "react";
import { Container } from "flux/utils";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import EditUserModal from "./EditUserModal.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import { LinkTypes } from "../../constants/LinkConstants";
import LinkList from "../../forms/LinkList.jsx";
import LinkListStore, { NewLinkInfo } from "../../stores/LinkListStore.js";
import url from "../../utils/url.js";
import FormValidation from "../../forms/FormValidation.jsx";
import _ from "lodash";

type Props = {|
  showModal: boolean,
  user: UserAPIData,
  onEditClose: UserAPIData => void,
|};
type State = {|
  showModal: boolean,
  linkList: any,
  linkErrors: $ReadOnlyArray<string>,
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
    // TODO: Use form field store instead
    return [LinkListStore];
  }

  static calculateState(prevState: State): State {
    let state: State = _.clone(prevState) || {};
    state.linkList = LinkListStore.getLinkList();
    state.linkErrors = LinkListStore.getLinkErrors();
    return state;
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (!this.state.showModal && nextProps.showModal) {
      const user: UserAPIData = nextProps.user;

      UniversalDispatcher.dispatch({
        type: "SET_LINK_LIST",
        links: user.user_links,
        presetLinks: [LinkTypes.LINKED_IN],
      });
    }
    this.setState({ showModal: nextProps.showModal });
  }

  _serializeLinks(): string {
    this.state.linkList.forEach((link: NewLinkInfo) => {
      link.linkUrl = url.appendHttpIfMissingProtocol(link.linkUrl);
    });
    return JSON.stringify(this.state.linkList || []);
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
          />
          <FormValidation errorMessages={this.state.linkErrors} />
        </div>
      </EditUserModal>
    );
  }
}

export default Container.create(EditUserBioModal);
