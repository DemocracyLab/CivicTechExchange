// @flow

import SectionController from './SectionController.jsx';
import MainHeader from '../chrome/MainHeader.jsx';
import UniversalDispatcher from '../stores/UniversalDispatcher.js';
import React from 'react';
import MainFooter from "../chrome/MainFooter.jsx";
import SocialFooter from "../chrome/SocialFooter.jsx";
import url from '../../components/utils/url.js';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';


type State = {|
  headerHeight: number,
  currentSection: ?string
|};

class MainController extends React.Component<{||}, State> {
  constructor() {
    super();
    window.addEventListener("popstate", this.loadPage.bind(this));
    this.state = {
      headerHeight: 0,
      currentSection: null
    };
  }

  componentWillMount(): void {
    this.loadPage();
  }

  loadPage(): void {
    const args = url.arguments(url.cleanDemocracyLabUrl());
    if (args.section) {
      UniversalDispatcher.dispatch({
        type: 'SET_SECTION',
        section: args.section,
        url: window.location.href,
        fromUrl: true
      });
      this.setState({currentSection: args.section});
    }
  }

  _mainHeaderHeightChange(headerHeight) {
    this.setState({
      headerHeight: headerHeight
    });
  }

  render() {
    return (
      // because the ReCaptcha has to wrap the whole site it's acting as the one element for render() 
      <GoogleReCaptchaProvider
        reCaptchaKey={window.GRV3_SITEKEY}
        useRecaptchaNet
        scriptProps={{
          async: true,
          defer: true,
          appendTo: "head"
        }}
      >
        <MainHeader key='main_header' onMainHeaderHeightChange={this._mainHeaderHeightChange.bind(this)}/>
        <SectionController key='section_controller' headerHeight={this.state.headerHeight}/>
        <MainFooter key='main_footer'/>
        <SocialFooter key='social_footer'/>
      </GoogleReCaptchaProvider>
    );
  }
}

export default MainController;
