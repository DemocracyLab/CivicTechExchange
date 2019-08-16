// @flow

import React from "react";
import DjangoCSRFToken from "django-react-csrftoken";
import FormValidation from "../../../components/forms/FormValidation.jsx";
import type {Validator} from "../../../components/forms/FormValidation.jsx";
import type {ProjectDetailsAPIData} from "../../../components/utils/ProjectAPIUtils.js";
import form, {FormPropsBase, FormStateBase} from "../../utils/forms.js";
import _ from "lodash";
import ProjectCardsContainer from '../FindProjects/ProjectCardsContainer.jsx';


type FormFields = {|
  project_description: ?string,
  selected_projects: ?Array<string>,
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
 * Encapsulates form for Project Description section
 */
class GroupProjectSelectionForm extends React.PureComponent<Props,State> {
  constructor(props: Props): void {
    super(props);
    console.log('GroupProjectSelectionForm:ctor:props', props)
    const project: ProjectDetailsAPIData = props.project;
    this.state = {
      selectedProjects: [],
      formIsValid: false,
      formFields: {
        selectedProjects: [],
      },
    };
    
    this.form = form.setup();
    props.readyForSubmit(true, this.onSubmit.bind(this));
    this.addProjectToSelectedProjects = this.addProjectToSelectedProjects.bind(this);
  }
  
  componentDidMount() {
    // Initial validation check
    this.form.doValidation.bind(this)();
  }

  onSubmit(submitFunc: Function): void {
    console.log('ON SUBMIT IN SELECTION');
    this.setState({}, submitFunc);
  }

  onValidationCheck(formIsValid: boolean): void {
    this.props.readyForSubmit(true);

    if(formIsValid !== this.state.formIsValid) {
      this.setState({formIsValid});
      this.props.readyForSubmit(true);
    }
  }

  addProjectToSelectedProjects(project: Project): void {
    console.log('addProjectToSelectedProjects:project', project);
    if (this.state.selectedProjects.includes(project)) {
      return;
    }
    const updatedSelectProjects = [...this.state.selectedProjects, project];
    console.log('addProjectToSelectedProjects:updatedSelectProjects', updatedSelectProjects);

    // Todo: wrap in proper state management
    projectSelectorSingleton = updatedSelectProjects;

    this.setState({
      selectedProjects: updatedSelectProjects,
    })
  }

  render(): React$Node {
    return (
      <div className="EditProjectForm-root">
        <DjangoCSRFToken/>
          {/* <textarea className="form-control" id="project_description" name="project_description"
                    placeholder="Describe the problem your project is solving..." rows="6" maxLength="1000"
                    value={this.state.formFields.project_description} onChange={this.form.onInput.bind(this, "project_description")}>
          </textarea> */}
        <div style={{ marginBottom: '20px' }}>
          Which projects are associated with your group?
        </div>
          {
            this.state.selectedProjects.map(project => {
              // need pill buttons or tags
              return (
                <div>{project.name}</div>
              )
            })
          }

          <div className="row">
            <ProjectCardsContainer 
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

export default GroupProjectSelectionForm;