// @flow

import SectionController from './SectionController.jsx';
import MainHeader from '../chrome/MainHeader.jsx';
import UniversalDispatcher from '../stores/UniversalDispatcher.js';
import React from 'react';
import FlashMessage from '../chrome/FlashMessage.jsx';
import MainFooter from "../chrome/MainFooter.jsx";
import url from '../../components/utils/url.js'

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
    const args = url.arguments(window.location.href);
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

  render(): Array<React$Node> {
    return [
      <MainHeader key='main_header' onMainHeaderHeightChange={this._mainHeaderHeightChange.bind(this)}/>,
      <FlashMessage key='flash_message'/>,
      <SectionController key='section_controller' headerHeight={this.state.headerHeight}/>,
      <MainFooter key='main_footer'/>
    ];
  }
}

export default MainController;
