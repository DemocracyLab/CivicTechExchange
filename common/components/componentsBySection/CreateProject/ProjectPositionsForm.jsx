// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import type { Validator } from "../../forms/FormValidation.jsx";
import type { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import { OnReadySubmitFunc } from "./ProjectFormCommon.jsx";
import { PositionInfo } from "../../forms/PositionInfo.jsx";
import PositionList from "../../forms/PositionList.jsx";
import _ from "lodash";
import { Container } from "flux/utils";
import FormFieldsStore from "../../stores/FormFieldsStore.js";
import UniversalDispatcher from "../../stores/UniversalDispatcher.js";
import type { Dictionary } from "../../types/Generics.jsx";

type FormFields = {|
  project_positions?: Array<PositionInfo>,
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: OnReadySubmitFunc,
|} & FormPropsBase<FormFields>;

type State = {|
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Project Overview section
 */
class ProjectPositionsForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    const formFields: Dictionary<any> = {
      project_positions: project ? project.project_positions : [],
    };
    this.state = {
      formFields: formFields,
    };

    this.state = {
      formFields: formFields,
    };

    UniversalDispatcher.dispatch({
      type: "SET_FORM_FIELDS",
      formFieldValues: formFields,
      validators: [],
    });
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [FormFieldsStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {};
    state.formFields = _.clone(FormFieldsStore.getFormFieldValues());
    return state;
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <div className="form-group">
          <PositionList
            elementid="project_positions"
            positions={this.state.formFields.project_positions}
          />
        </div>
      </div>
    );
  }
}

export default Container.create(ProjectPositionsForm, { withProps: true });
