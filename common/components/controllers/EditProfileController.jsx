// @flow

import React from 'react'
import DjangoCSRFToken from 'django-react-csrftoken'
import url from '../utils/url.js';
import UserAPIUtils from "../utils/UserAPIUtils.js";
import type {UserAPIData} from "../utils/UserAPIUtils.js";

type FormFields = {|
  +first_name: string,
  +last_name: string,
  +about_me: string
|};

type State = {|
  formFields: number
|};

/**
 * Encapsulates form for editing projects
 */
class EditProfileController extends React.PureComponent<{||},State> {
  constructor(props: {||}): void {
    super(props);
  
    this.state = {
      formFields: {
        first_name: "",
        last_name: "",
        about_me: ""
      }
    }
    
  }
  
  componentDidMount(): void {
    // TODO: Show error message on failure to load
    UserAPIUtils.fetchUserDetails(window.DLAB_GLOBAL_CONTEXT.userID, this.loadUserDetails.bind(this));
  }
  
  loadUserDetails(user: UserAPIData): void {
    this.setState({
      formFields: {
        first_name: user.first_name,
        last_name: user.last_name,
        about_me: user.about_me
      }
    });
  }
  
  onFormFieldChange(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
  }
  
  onSubmit(): void {
    // TODO: Do any pre-submit processing here
  }
  
  render(): React$Node {
    return (
      <div className="wrapper-gray">
        <div className="container">
          <form action={`/api/user/edit/${window.DLAB_GLOBAL_CONTEXT.userID}/`} method="post">
            <div className="EditProjectForm-root">
              <DjangoCSRFToken/>
  
              <div className="form-group">
                <label>
                  ABOUT ME
                </label>
                <div className="character-count">
                  { (this.state.formFields.about_me || "").length} / 2000
                </div>
                <textarea className="form-control" id="about_me" name="about_me" rows="6" maxLength="2000"
                          value={this.state.formFields.about_me} onChange={this.onFormFieldChange.bind(this, "about_me")}/>
              </div>
              
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" id="first_name" name="first_name" maxLength="30"
                       value={this.state.formFields.first_name} onChange={this.onFormFieldChange.bind(this, "first_name")}/>
              </div>
  
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" id="last_name" name="last_name" maxLength="30"
                       value={this.state.formFields.last_name} onChange={this.onFormFieldChange.bind(this, "last_name")}/>
              </div>
  
              <div className="form-group pull-right">
                <div className='text-right'>
                  <input type="submit" className="btn_outline save_btn"
                         value="Save Changes" onClick={this.onSubmit.bind(this)}/>
                </div>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  
}

export default EditProfileController;
