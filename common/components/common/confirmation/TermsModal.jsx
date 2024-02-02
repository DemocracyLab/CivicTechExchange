// @flow

import React from "react";
import NotificationModal from "../notification/NotificationModal.jsx";
import type { Dictionary } from "../../types/Generics.jsx";
import { TermsUse, TermsVolunteer } from "./TermsText.jsx"
import _ from "lodash";

export const TermsTypes: Dictionary<string> = {
  UserSignup: "UserSignup",
  OrgSignup: "OrgSignup",
};

export type TermsType = $Keys<typeof TermsTypes>;

type TermsConfig = {|
  headerText: string,
  termsContent: () => React$Node,
|};

type Props = {|
  termsType: TermsType,
  showModal: boolean,
  onSelection: () => void,
|};
type State = {|
  showModal: boolean,
  termsConfigurations: Dictionary<TermsConfig>,
|};

/**
 * Modal for getting yes/no confirmation
 */
class TermsModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
      termsConfigurations: _.fromPairs([
        [
          TermsTypes.UserSignup,
          {
            headerText: "Terms of Volunteering",
            termsContent: this._renderUserSignupTerms,
          },
        ],
        [
          TermsTypes.OrgSignup,
          {
            headerText: "Terms of Use",
            termsContent: this._renderOrgSignupTerms,
          },
        ],
      ]),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    this.setState({ showModal: nextProps.showModal });
  }

  confirm(): void {
    this.props.onSelection();
    this.setState({
      showModal: false,
    });
  }

  render(): React$Node {
    const termsConfig = this.state.termsConfigurations[this.props.termsType];
    return (
      <NotificationModal
        headerText={termsConfig.headerText}
        buttonText="Close and Continue"
        showModal={this.state.showModal}
        onClickButton={this.confirm.bind(this)}
      >
        <div className="Terms-body">{termsConfig.termsContent()}</div>
      </NotificationModal>
    );
  }

  _renderUserSignupTerms(): React$Node {
    return <TermsVolunteer />
  }

  _renderOrgSignupTerms(): React$Node {
    return <TermsUse />
  }
}

export default TermsModal;
