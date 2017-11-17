import SectionController from './SectionController.jsx';
import MainHeader from '../chrome/MainHeader.jsx';
import React from 'react';
import Section from '../enums/Section.js';
import SubHeader from '../chrome/SubHeader.jsx';

class MainController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      section: Section.Landing,
    };
  }

  render() {
    return (
      <div>
        <MainHeader />
        <SubHeader
          onChangeSection={section => this.setState({section})}
          activeSection={this.state.section}
        />
        <SectionController section={this.state.section}/>
      </div>
    );
  }
}

export default MainController;
