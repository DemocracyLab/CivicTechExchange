// @flow

import type {FluxReduceStore} from 'flux/utils';
import type {SectionType} from '../enums/Section.js';

import {Container} from 'flux/utils';
import AboutProjectController from './AboutProjectController.jsx'
import AboutUsController from './AboutUsController.jsx'
import CreateProjectController from './CreateProjectController.jsx'
import EditProjectController from './EditProjectController.jsx'
import FindProjectsController  from './FindProjectsController.jsx'
import LandingController from './LandingController.jsx'
import MyProjectsController from './MyProjectsController.jsx'
import NavigationStore from '../stores/NavigationStore.js'
import React from 'react';
import Section from '../enums/Section.js'
import LogInController from './LogInController.jsx'
import SignUpController from './SignUpController.jsx'
import ResetPasswordController from "./ResetPasswordController.jsx";
import ChangePasswordController from "./ChangePasswordController.jsx";
import EditProfileController from "./EditProfileController.jsx";
import AboutUserController from "./AboutUserController.jsx";
import SignedUpController from "./SignedUpController.jsx";
import EmailVerifiedController from "./EmailVerifiedController.jsx";
import PartnerWithUsController from "./PartnerWithUsController.jsx";
import FlashMessage from "../chrome/FlashMessage.jsx";
import DonateController from "./DonateController.jsx";
import ThankYouController from "./ThankYouController.jsx";
import PressController from './PressController.jsx';
import ContactUsController from './ContactUsController.jsx';
import CreateOrganizationController from './CreateOrganizationController.jsx';

type State = {|
  section: SectionType,
|};

class SectionController extends React.Component<{||}, State> {
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [NavigationStore];
  }

  static calculateState(prevState: State): State {
    return {
      section: NavigationStore.getSection(),
    };
  }

  render(): React$Node {
    return (
      <div className="SectionBody" style={{ paddingTop: this.props.headerHeight }}>
        <FlashMessage key='flash_message'/>
        {this._getController()}
      </div>
    );
  }

  _getController(): React$Node {
    switch (this.state.section) {
      case Section.AboutProject:
        return <AboutProjectController />;
      case Section.AboutUs:
        return <AboutUsController />;
      case Section.CreateProject:
        return <CreateProjectController />;
      case Section.EditProject:
        return <EditProjectController />;
      case Section.FindProjects:
        return <FindProjectsController />;
      case Section.Landing:
        return <LandingController />;
      case Section.MyProjects:
        return <MyProjectsController />;
      case Section.SignUp:
        return <SignUpController />;
      case Section.LogIn:
        return <LogInController />;
      case Section.ResetPassword:
        return <ResetPasswordController />;
      case Section.ChangePassword:
        return <ChangePasswordController />;
      case Section.EditProfile:
        return <EditProfileController />;
      case Section.Profile:
        return <AboutUserController />;
      case Section.SignedUp:
        return <SignedUpController />;
      case Section.EmailVerified:
        return <EmailVerifiedController />;
      case Section.PartnerWithUs:
        return <PartnerWithUsController />;
      case Section.Donate:
        return <DonateController />;
      case Section.ThankYou:
        return <ThankYouController />;
      case Section.Press:
        return <PressController />;
      case Section.ContactUs:
        return <ContactUsController />;
      case Section.CreateOrganization:
        return <CreateOrganizationController />;
      default:
        return <div>Section not yet implemented: {this.state.section}</div>
    }
  }
}

export default Container.create(SectionController);
