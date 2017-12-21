// @flow

import type {SectionType} from '../enums/Section.js';

import FindProjectsController  from './FindProjectsController.jsx'
import LandingController from './LandingController.jsx'
import MyProjectsController from './MyProjectsController.jsx'
import React from 'react';
import Section from '../enums/Section.js'

type Props = {|
  +section: SectionType,
|};

class SectionController extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        {this._getController()}
      </div>
    );
  }

  _getController(): React$Node {
    switch (this.props.section) {
      case Section.Landing:
        return <LandingController />;
      case Section.MyProjects:
        return <MyProjectsController />;
      case Section.FindProjects:
        return <FindProjectsController />;
      default:
        return <div>Section not yet implemented: {this.props.section}</div>
    }
  }
}

export default SectionController;
