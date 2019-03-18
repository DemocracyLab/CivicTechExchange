// @flow

import SectionController from './SectionController.jsx';
import MainHeader from '../chrome/MainHeader.jsx';
import UniversalDispatcher from '../stores/UniversalDispatcher.js';
import React from 'react';
import FlashMessage from '../chrome/FlashMessage.jsx';
import url from '../../components/utils/url.js'
import MainFooter from "../chrome/MainFooter.jsx";

class MainController extends React.Component<{||}> {
  constructor() {
    super();
    window.addEventListener("popstate", this.loadPage.bind(this));
  }
  
  componentWillMount(): void {
    this.loadPage();
  }
  
  loadPage(): void {
    const args = url.arguments(window.location.href);
    if (args.section) {
      UniversalDispatcher.dispatch({
        type: 'SET_SECTION',
        section: args.section,
        url: window.location.href,
        fromUrl: true
      });
    }
  }

  render(): React$Node {
    return [
      <MainHeader key='main_header'/>,
      <FlashMessage key='flash_message'/>,
      <SectionController key='section_controller'/>,
      <MainFooter key='main_footer'/>
    ];
  }
}

export default MainController;
