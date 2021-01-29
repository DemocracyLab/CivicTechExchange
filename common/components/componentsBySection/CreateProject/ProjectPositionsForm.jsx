// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import type { Validator } from "../../../components/forms/FormValidation.jsx";
import type { ProjectDetailsAPIData } from "../../../components/utils/ProjectAPIUtils.js";
import formHelper, { FormPropsBase, FormStateBase } from "../../utils/forms.js";
import { OnReadySubmitFunc } from "./ProjectFormCommon.jsx";
import { PositionInfo } from "../../forms/PositionInfo.jsx";
import PositionList from "../../forms/PositionList.jsx";
import _ from "lodash";

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
class ProjectPositionsForm extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    const project: ProjectDetailsAPIData = props.project;
    this.state = {
      formIsValid: true,
      formFields: {
        project_positions: project ? project.project_positions : [],
      },
    };

    this.form = formHelper.setup();
    // All fields optional
    props.readyForSubmit(true);
  }

  componentDidMount() {
    this.form.doValidation.bind(this)();
  }

  render(): React$Node {
    PositionList;
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken />

        <div className="form-group">
          <PositionList
            elementid="project_positions"
            positions={this.state.formFields.project_positions}
            onChange={this.form.onFormChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default ProjectPositionsForm;
