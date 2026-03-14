// @flow

import type { FluxReduceStore } from "flux/utils";
import type { SectionType } from "../enums/Section.js";

import { Container } from "flux/utils";
import AboutProjectController from "./AboutProjectController.jsx";
import AboutUsController from "./AboutUsController.jsx";
import CreateProjectController from "./CreateProjectController.jsx";
import FindProjectsController from "./FindProjectsController.jsx";
import LandingController from "./LandingController.jsx";
import MyProjectsController from "./MyProjectsController.jsx";
import NavigationStore from "../stores/NavigationStore.js";
import React from "react";
import Section from "../enums/Section.js";
import LogInController from "./LogInController.jsx";
import SignUpController from "./SignUpController.jsx";
import ResetPasswordController from "./ResetPasswordController.jsx";
import ChangePasswordController from "./ChangePasswordController.jsx";
import AboutUserController from "./AboutUserController.jsx";
import SignedUpController from "./SignedUpController.jsx";
import EmailVerifiedController from "./EmailVerifiedController.jsx";
import FlashMessage from "../chrome/FlashMessage.jsx";
import DonateController from "./DonateController.jsx";
import ThankYouController from "./ThankYouController.jsx";
import ContactUsController from "./ContactUsController.jsx";
import CreateGroupController from "./CreateGroupController.jsx";
import CreateEventController from "./CreateEventController.jsx";
import MyGroupsController from "./MyGroupsController.jsx";
import LiveEventController from "./LiveEventController.jsx";
import AboutEventController from "./AboutEventController.jsx";
import AboutGroupController from "./AboutGroupController.jsx";
import IframeGroupController from "./IframeGroupController.jsx";
import ErrorController from "./ErrorController.jsx";
import FindGroupsController from "./FindGroupsController.jsx";
import FindEventsController from "./FindEventsController.jsx";
import CoroporateHackathonController from "./CorporateHackathonController.jsx";
import MyEventsController from "./MyEventsController.jsx";
import AddSignUpDetails from "./AddSignUpDetails.jsx";
import VideoController from "./VideoController.jsx";
import AboutEventProjectController from "./AboutEventProjectController.jsx";
import CreateEventProjectController from "./CreateEventProjectController.jsx";
import PrivacyController from "./PrivacyController.jsx";
import TermsController from "./TermsController.jsx";
import GroupProjectsController from "./GroupProjectsController.jsx";

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
      <div
        className="SectionBody"
        style={{ paddingTop: this.props.headerHeight }}
      >
        <FlashMessage key="flash_message" />
        {this._getController()}
      </div>
    );
  }

  _getController(): React$Node {
    switch (this.state.section) {
      case Section.IframeProject:
        return <AboutProjectController />
      case Section.AboutProject:
        return <AboutProjectController />;
      case Section.AboutUs:
        return <AboutUsController />;
      case Section.CreateProject:
        return <CreateProjectController />;
      case Section.FindProjects:
        return <FindProjectsController />;
      case Section.FindGroups:
        return <FindGroupsController />;
      case Section.FindEvents:
        return <FindEventsController />;
      case Section.Home:
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
      case Section.Profile:
        return <AboutUserController />;
      case Section.SignedUp:
        return <SignedUpController />;
      case Section.EmailVerified:
        return <EmailVerifiedController />;
      case Section.Donate:
        return <DonateController />;
      case Section.ThankYou:
        return <ThankYouController />;
      case Section.ContactUs:
        return <ContactUsController />;
      case Section.CreateGroup:
        return <CreateGroupController />;
      case Section.CreateEvent:
        return <CreateEventController />;
      case Section.AboutGroup:
        return <AboutGroupController />;
      case Section.IframeGroup:
        return <IframeGroupController />;
      case Section.MyGroups:
        return <MyGroupsController />;
      case Section.MyEvents:
        return <MyEventsController />;
      case Section.GroupProjects:
        return <GroupProjectsController/>
      case Section.AboutEvent:
        return <AboutEventController />;
      case Section.LiveEvent:
        return <LiveEventController />;
      case Section.Companies:
        return <CoroporateHackathonController />;
      case Section.Error:
        return <ErrorController />;
      case Section.AddUserDetails:
        return <AddSignUpDetails />;
      case Section.VideoOverview:
        return <VideoController />;
      case Section.AboutEventProject:
        return <AboutEventProjectController />;
      case Section.CreateEventProject:
        return <CreateEventProjectController />;
      case Section.Privacy:
        return <PrivacyController />;
      case Section.Terms:
        return <TermsController />;
      default:
        return <div>Section not yet implemented: {this.state.section}</div>;
    }
  }
}

export default Container.create(SectionController);
