// @flow

import type {FluxReduceStore} from 'flux/utils';
import type {SectionType} from '../enums/Section.js';

import {Container} from 'flux/utils';
import AboutProjectController from './AboutProjectController.jsx'
import CreateProjectController from './CreateProjectController.jsx'
import EditProjectController from './EditProjectController.jsx'
import FindProjectsController  from './FindProjectsController.jsx'
import LandingController from './LandingController.jsx'
import MyProjectsController from './MyProjectsController.jsx'
import NavigationStore from '../stores/NavigationStore.js'
import React from 'react';
import Section from '../enums/Section.js'

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
      <div>
        {this._getController()}
      </div>
    );
  }

  _getController(): React$Node {
    switch (this.state.section) {
      case Section.AboutProject:
        return <AboutProjectController />;
      case Section.CreateProject:
        return <CreateProjectController />;
      case Section.EditProject:
        return <EditProjectController />;
      case Section.FindProjects:
        return <FindProjectsController />;
      case Section.Landing:
        return <LandingController />;
      case Section.MyProjects:
        return <MyProjectsController />;
      default:
        return <div>Section not yet implemented: {this.state.section}</div>
    }
  }
}

export default Container.create(SectionController);
