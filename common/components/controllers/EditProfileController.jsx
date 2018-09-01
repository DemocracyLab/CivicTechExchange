// @flow

import React from 'react'
import DjangoCSRFToken from 'django-react-csrftoken'
import UserAPIUtils from "../utils/UserAPIUtils.js";
import type {UserAPIData} from "../utils/UserAPIUtils.js";
import {CountrySelector, defaultCountryCode} from "../common/selection/CountrySelector.jsx";
import TagCategory from "../common/tags/TagCategory.jsx";
import TagSelector from "../common/tags/TagSelector.jsx";


type FormFields = {|
  +first_name: string,
  +last_name: string,
  +about_me: string,
  +technologies_used: Array<TagDefinition>,
  +postal_code: string,
  +country: string
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
        about_me: "",
        technologies_used: [],
        postal_code: "",
        country: defaultCountryCode
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
        about_me: user.about_me,
        postal_code: user.postal_code,
        country: user.country || defaultCountryCode
      }
    });
  }
  
  onFormFieldChange(formFieldName: string, event: SyntheticInputEvent<HTMLInputElement>): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
  }
  
  onTagChange(formFieldName: string, value: string): void {
    this.state.formFields[formFieldName] = value;
  }
  
  handleCountrySelection(selectedValue: string): void {
    let formFields: FormFields = this.state.formFields;
    formFields.country = selectedValue;
    this.setState({formFields: formFields}, function() {
      this.forceUpdate();
    });
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
  
              <div className="form-group">
                <label>Technologies Used</label>
                <TagSelector
                  elementId="technologies_used"
                  value={this.state.formFields.technologies_used}
                  category={TagCategory.TECHNOLOGIES_USED}
                  allowMultiSelect={true}
                  onSelection={this.onTagChange.bind(this, "technologies_used")}
                />
              </div>
  
              <div className="form-group">
                <label>Country</label>
                <CountrySelector
                  countryCode={this.state.formFields.country}
                  onSelection={this.handleCountrySelection.bind(this)}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="postal_code">Zip/Postal Code</label>
                <input type="text" className="form-control" id="postal_code" name="postal_code" maxLength="10"
                       value={this.state.formFields.postal_code} onChange={this.onFormFieldChange.bind(this, "postal_code")}/>
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
