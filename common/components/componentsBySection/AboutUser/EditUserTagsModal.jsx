// @flow

import React from "react";
import { UserAPIData } from "../../utils/UserAPIUtils.js";
import EditUserModal from "./EditUserModal.jsx";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import TagSelector from "../../common/tags/TagSelector.jsx";
import TagCategory from "../../common/tags/TagCategory.jsx";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";

type Props = {|
  showModal: boolean,
  user: UserAPIData,
  onEditClose: UserAPIData => void,
|};
type State = {|
  showModal: boolean,
|};

type FormFields = {|
  user_technologies: $ReadOnlyArray<TagDefinition>,
|};

/**
 * Modal for editing user technologies
 */
class EditUserTagsModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);

    this.state = {
      showModal: false,
      isProcessing: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (!this.state.showModal && nextProps.showModal) {
      const user: UserAPIData = nextProps.user;
      const formFieldsValues: FormFields = {
        user_technologies: user.user_technologies,
      };

      UniversalDispatcher.dispatch({
        type: "SET_FORM_FIELDS",
        formFieldValues: formFieldsValues,
      });
    }
    this.setState({ showModal: nextProps.showModal });
  }

  static extractTagSlugsAsString(tags: $ReadOnlyArray<TagDefinition>): string {}

  render(): React$Node {
    return (
      <EditUserModal
        showModal={this.props.showModal}
        user={this.props.user}
        fields={["user_technologies"]}
        onEditClose={this.props.onEditClose}
      >
        <div className="form-group">
          <label>Technologies Used</label>
          <TagSelector
            elementId="user_technologies"
            useFormFieldsStore={true}
            category={TagCategory.TECHNOLOGIES_USED}
            allowMultiSelect={true}
          />
        </div>
      </EditUserModal>
    );
  }
}

export default EditUserTagsModal;
