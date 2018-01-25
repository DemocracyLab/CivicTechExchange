// @flow

import SectionController from './SectionController.jsx';
import MainHeader from '../chrome/MainHeader.jsx';
import NavigationDispatcher from '../stores/NavigationDispatcher.js';
import React from 'react';
import Section from '../enums/Section.js';
import SubHeader from '../chrome/SubHeader.jsx';

class MainController extends React.Component<{||}> {
  componentWillMount(): void {
    const section = new URL(window.location.href).searchParams.get('section');
    if (Object.keys(Section).includes(section)) {
      
      NavigationDispatcher.dispatch({type: 'SET_SECTION', section: section, url:window.location.href});
    }
  }

  render(): React$Node {
    return [
      <MainHeader key='main_header'/>,
      <SubHeader key='sub_header'/>,
      <SectionController key='section_controller'/>,
    ];
  }
}

export default MainController;
