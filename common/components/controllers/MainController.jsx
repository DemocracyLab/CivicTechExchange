// @flow

import SectionController from './SectionController.jsx';
import MainHeader from '../chrome/MainHeader.jsx';
import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
import Section from '../enums/Section.js';
import SubHeader from '../chrome/SubHeader.jsx';
import FlashMessage from '../chrome/FlashMessage.jsx';
import url from '../../components/utils/url.js'
import MainFooter from "../chrome/MainFooter.jsx";

class MainController extends React.Component<{||}> {
  componentWillMount(): void {
    const args = url.arguments(window.location.href);
    if (args.section) {
      NavigationDispatcher.dispatch({type: 'SET_SECTION', section: args.section, url:window.location.href});
    }
  }

  render(): React$Node {
    return [
      <MainHeader key='main_header'/>,
      <SubHeader key='sub_header'/>,
      <FlashMessage key='flash_message'/>,
      <SectionController key='section_controller'/>,
      <MainFooter/>
    ];
  }
}

export default MainController;
