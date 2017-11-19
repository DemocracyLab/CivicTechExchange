import SectionController from './SectionController.jsx';
import MainHeader from '../chrome/MainHeader.jsx';
import React from 'react';
import Section from '../enums/Section.js';
import SubHeader from '../chrome/SubHeader.jsx';

class MainController extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      section: Section.Landing,
    };
  }

  componentWillMount() {
    const section = new URL(window.location.href).searchParams.get('section');
    if (Object.keys(Section).includes(section)) {
      this.setState({section});
    }
  }

  render() {
    return (
      <div>
        <MainHeader onChangeSection={this._onChangeSection.bind(this)}/>
        <SubHeader
          onChangeSection={this._onChangeSection.bind(this)}
          activeSection={this.state.section}
        />
        <SectionController section={this.state.section}/>
      </div>
    );
  }

  _onChangeSection(section) {
    history.pushState({}, '', "?section=" + section)
    this.setState({section});
  }
}

export default MainController;
