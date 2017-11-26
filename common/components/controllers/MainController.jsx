// @flow
import SectionController from './SectionController.jsx';
import MainHeader from '../chrome/MainHeader.jsx';
import React from 'react';
import Section from '../enums/Section.js';
import SubHeader from '../chrome/SubHeader.jsx';

type State = {|
  section: $Keys<typeof Section>,
|};

class MainController extends React.PureComponent<void, State> {

  constructor(): void {
    super();
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

  _onChangeSection(section: $Keys<typeof Section>) {
    history.pushState({}, '', "?section=" + section)
    this.setState({section});
  }
}

export default MainController;
