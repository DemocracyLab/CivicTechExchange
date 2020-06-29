// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import ProjectAPIUtils, {ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";
import ProjectCardsContainer from '../FindProjects/ProjectCardsContainer.jsx';
import {EventData} from "../../utils/EventAPIUtils.js";

type FormFields = {|
  selected_projects: ?Array<string>
|};

type Props = {|
  project: ?ProjectDetailsAPIData,
  readyForSubmit: () => () => boolean,
|} & FormPropsBase<FormFields>;

type State = {|
  selectedProjects: Array<Project>,
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
|} & FormStateBase<FormFields>;

/**
 * Encapsulates form for Project selection
 */
class EventProjectSelectionForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    const event: EventData = props.project;
    this.state = {
      selectedProjects: event.event_projects ? event.event_projects.map(ProjectAPIUtils.projectFromAPIData) : [],
      formIsValid: false,
      formFields: {
        selectedProjects: [],
      },
    };

    this.form = form.setup();
    props.readyForSubmit(true, this.onSubmit.bind(this));
    this.addProjectToSelectedProjects = this.addProjectToSelectedProjects.bind(this);

    this.projectIdsField = React.createRef();
  }

  componentDidMount() {
    // Initial validation check
    this.form.doValidation.bind(this)();
  }

  onSubmit(submitFunc: Function): void {
    this.setState({}, submitFunc);
  }

  onValidationCheck(formIsValid: boolean): void {
    this.props.readyForSubmit(true);

    if(formIsValid !== this.state.formIsValid) {
      this.setState({formIsValid});
      this.props.readyForSubmit(true);
    }
  }

  addProjectToSelectedProjects(project: ProjectData): void {
    if (projectSelectionStoreSingleton.includes(project)) {
      return;
    }

    projectSelectionStoreSingleton.push(project);
    this.projectIdsField.current.value = JSON.stringify();
    this.setState({
      selectedProjects: [...projectSelectionStoreSingleton],
    });
  }

  render(): React$Node {
    // TODO: Move styles to css file
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken/>

        <div style={{ marginBottom: '20px' }}>
          Which projects are participating in your event?
        </div>

        <input type="hidden" ref={this.projectIdsField} id="" name=""/>

        <div className="create-selected-projects">
          {
            this.state.selectedProjects.map(project => {
              // need pill buttons or tags
              return (
                <div className="create-selected-project-name">
                  {project.name}
                </div>
              )
            })
          }
        </div>

          <div className="row">
            <ProjectCardsContainer
              showSearchControls={true}
              alreadySelectedProjects={this.state.selectedProjects}
              onSelectProject={(project) => this.addProjectToSelectedProjects(project)}
              fullWidth={true}
              selectableCards={true}
            />
          </div>
      </div>
    );
  }
}

export default EventProjectSelectionForm;
