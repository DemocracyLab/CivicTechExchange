// @flow

import React from "react";
import { Container } from "flux/utils";
import DjangoCSRFToken from "django-react-csrftoken";
import UserAPIUtils from "../utils/UserAPIUtils.js";
import type { UserAPIData } from "../utils/UserAPIUtils.js";
import { CountrySelector } from "../common/selection/CountrySelector.jsx";
import { CountryData, DefaultCountry } from "../constants/Countries.js";
import TagCategory from "../common/tags/TagCategory.jsx";
import TagSelector from "../common/tags/TagSelector.jsx";
import LinkList from "../forms/LinkList.jsx";
import { LinkInfo } from "../forms/LinkInfo.jsx";
import { FileInfo } from "../common/FileInfo.jsx";
import ImageCropUploadFormElement from "../forms/ImageCropUploadFormElement.jsx";
import FileUploadList from "../forms/FileUploadList.jsx";
import FormValidation, { Validator } from "../forms/FormValidation.jsx";
import formHelper from "../utils/forms.js";
import metrics from "../utils/metrics.js";
import CurrentUser from "../utils/CurrentUser.js";
import url from "../utils/url.js";
import { LinkTypes } from "../constants/LinkConstants.js";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import LinkListStore, { NewLinkInfo } from "../stores/LinkListStore.js";
import HiddenFormFields from "../forms/HiddenFormFields.jsx";
import _ from "lodash";

export const UserFileTypes = {
  RESUME: "RESUME",
};

type FormFields = {|
  user_thumbnail?: FileInfo,
  first_name: string,
  last_name: string,
  about_me: string,
  user_resume_file: Array<FileInfo>,
  user_technologies: Array<TagDefinition>,
  postal_code: string,
  country: string,
  user_links: Array<LinkInfo>,
  user_files: Array<FileInfo>,
|};

type State = {|
  userId: number,
  formFields: FormFields,
  formIsValid: boolean,
  validations: $ReadOnlyArray<Validator>,
  linkErrors: $ReadOnlyArray<string>,
|};

/**
 * Encapsulates form for editing projects
 */
class EditProfileController extends React.Component<{||}, State> {
  constructor(props: {||}): void {
    super(props);
    const formFields: FormFields = {
      user_thumbnail: "",
      first_name: "",
      last_name: "",
      about_me: "",
      user_resume_file: [],
      user_technologies: [],
      postal_code: "",
      country: DefaultCountry.ISO_2,
      user_links: [],
      user_files: [],
    };
    const validations: $ReadOnlyArray<Validator<FormFields>> = [
      {
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["first_name"]),
        errorMessage: "Please enter First Name",
      },
      {
        checkFunc: (formFields: FormFields) =>
          !_.isEmpty(formFields["last_name"]),
        errorMessage: "Please enter Last Name",
      },
    ];
    const formIsValid: boolean = FormValidation.isValid(
      formFields,
      validations
    );
    this.state = {
      userId:
        (CurrentUser.isStaff() && url.argument("id")) ||
        window.DLAB_GLOBAL_CONTEXT.userID,
      formFields: formFields,
      formIsValid: formIsValid,
      validations: validations,
    };
    this.form = formHelper.setup();
  }

  componentDidMount(): void {
    // TODO: Show error message on failure to load
    UserAPIUtils.fetchUserDetails(
      this.state.userId,
      this.loadUserDetails.bind(this)
    );
    this.form.doValidation.bind(this)();
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [LinkListStore];
  }

  static calculateState(prevState: State, props: Props): State {
    let state: State = _.clone(prevState) || {
      formFields: {},
    };
    state.formFields.user_links = LinkListStore.getLinkList();
    state.linkErrors = LinkListStore.getLinkErrors();
    state.formIsValid = _.isEmpty(state.linkErrors);
    return state;
  }

  onValidationCheck(formIsValid: boolean): void {
    if (formIsValid !== this.state.formIsValid) {
      this.setState({ formIsValid });
    }
  }

  loadUserDetails(user: UserAPIData): void {
    this.setState({
      formFields: {
        first_name: user.first_name,
        last_name: user.last_name,
        about_me: user.about_me,
        user_links: user.user_links,
        postal_code: user.postal_code,
        country: user.country || DefaultCountry.ISO_2,
        user_technologies: user.user_technologies,
        user_resume_file: user.user_files.filter(
          (file: FileInfo) => file.fileCategory === UserFileTypes.RESUME
        ),
        user_files: user.user_files.filter(
          (file: FileInfo) => file.fileCategory !== UserFileTypes.RESUME
        ),
        user_thumbnail: user.user_thumbnail,
      },
    });

    metrics.logUserProfileEditEntry(CurrentUser.userID());
    UniversalDispatcher.dispatch({
      type: "SET_LINK_LIST",
      links: user.user_links,
      presetLinks: [LinkTypes.LINKED_IN],
    });
    this.forceUpdate();
  }

  onFormFieldChange(
    formFieldName: string,
    event: SyntheticInputEvent<HTMLInputElement>
  ): void {
    this.state.formFields[formFieldName] = event.target.value;
    this.forceUpdate();
  }

  onTagChange(formFieldName: string, value: string): void {
    this.state.formFields[formFieldName] = value;
  }

  handleCountrySelection(selectedValue: CountryData): void {
    let formFields: FormFields = this.state.formFields;
    formFields.country = selectedValue.ISO_2;
    this.setState({ formFields: formFields }, function() {
      this.forceUpdate();
    });
  }

  onSubmit(): void {
    let formFields = this.state.formFields;
    formFields.user_links = LinkListStore.getLinkList();
    formFields.user_links.forEach((link: NewLinkInfo) => {
      link.linkUrl = url.appendHttpIfMissingProtocol(link.linkUrl);
    });
    this.setState({ formFields: formFields });
    this.forceUpdate();
    metrics.logUserProfileEditSave(CurrentUser.userID());
  }

  render(): React$Node {
    return (
      <React.Fragment>
        <div className="container">
          <form
            action={`/api/user/edit/${this.state.userId}/`}
            method="post"
            className="row"
          >
            <div className="EditProjectForm-root create-form white-bg col-12">
              <DjangoCSRFToken />

              <div className="form-group text-right">
                <input
                  type="submit"
                  className="btn btn-success"
                  disabled={!this.state.formIsValid}
                  value="Save Changes"
                  onClick={this.onSubmit.bind(this)}
                />
              </div>

              <div className="form-group">
                <ImageCropUploadFormElement
                  form_id="user_thumbnail"
                  buttonText="Upload Your Picture"
                  currentImage={this.state.formFields.user_thumbnail}
                  aspect={1 / 1}
                />
              </div>

              <div className="form-group">
                <label>ABOUT ME</label>
                <div className="character-count">
                  {(this.state.formFields.about_me || "").length} / 2000
                </div>
                <textarea
                  className="form-control"
                  id="about_me"
                  name="about_me"
                  rows="6"
                  maxLength="2000"
                  value={this.state.formFields.about_me}
                  onChange={this.onFormFieldChange.bind(this, "about_me")}
                />
              </div>

              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  name="first_name"
                  maxLength="30"
                  value={this.state.formFields.first_name}
                  onChange={this.onFormFieldChange.bind(this, "first_name")}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  maxLength="30"
                  value={this.state.formFields.last_name}
                  onChange={this.onFormFieldChange.bind(this, "last_name")}
                />
              </div>

              <div className="form-group">
                <label>Technologies Used</label>
                <TagSelector
                  elementId="user_technologies"
                  value={this.state.formFields.user_technologies}
                  category={TagCategory.TECHNOLOGIES_USED}
                  allowMultiSelect={true}
                  onSelection={this.onTagChange.bind(this, "user_technologies")}
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
                <input
                  type="text"
                  className="form-control"
                  id="postal_code"
                  name="postal_code"
                  maxLength="10"
                  value={this.state.formFields.postal_code}
                  onChange={this.onFormFieldChange.bind(this, "postal_code")}
                />
              </div>

              <HiddenFormFields
                sourceDict={{
                  user_links: JSON.stringify(
                    this.state.formFields.user_links || []
                  ),
                }}
              />

              <div className="form-group create-form-block">
                <LinkList
                  title="Links"
                  subheader=""
                  linkOrdering={[LinkTypes.LINKED_IN]}
                  addLinkText="Add a new link"
                />
              </div>

              <div className="form-group create-form-block">
                <FileUploadList
                  elementid="user_resume_file"
                  title="Upload Resume"
                  singleFileOnly={true}
                  files={this.state.formFields.user_resume_file}
                />
              </div>

              <div className="form-group create-form-block">
                <FileUploadList
                  elementid="user_files"
                  title="Other Files"
                  files={this.state.formFields.user_files}
                />
              </div>

              <FormValidation
                validations={this.state.validations}
                onValidationCheck={this.onValidationCheck.bind(this)}
                formState={this.state.formFields}
                errorMessages={this.state.linkErrors}
              />

              <div className="form-group text-right">
                <input
                  type="submit"
                  className="btn btn-success"
                  disabled={!this.state.formIsValid}
                  value="Save Changes"
                  onClick={this.onSubmit.bind(this)}
                />
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Container.create(EditProfileController, { withProps: true });
