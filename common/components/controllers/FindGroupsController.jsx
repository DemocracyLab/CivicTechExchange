// @flow

import GroupSearchDispatcher from "../stores/GroupSearchDispatcher.js";
import TagDispatcher from '../stores/TagDispatcher.js';
import GroupCardsContainer from "../componentsBySection/FindGroups/GroupCardsContainer.jsx";
import GroupFilterContainer from "../componentsBySection/FindGroups/FIlters/GroupFilterContainer.jsx";
import {FindGroupsArgs} from "../stores/GroupSearchStore.js";
import Headers from "../common/Headers.jsx";
import SplashScreen, {HeroImage} from "../componentsBySection/FindProjects/SplashScreen.jsx";
import Button from "react-bootstrap/Button";
import Section from "../enums/Section";
import url from "../utils/url.js";
import React from 'react';
import _ from 'lodash'

class FindGroupsController extends React.PureComponent {
  constructor(): void {
    super();
    this.state = {showSplash: true};
  }

  componentWillMount(): void {
    let args: FindGroupsArgs = url.arguments(document.location.search);
    args = _.pick(args, ['showSplash','keyword','sortField','locationRadius','page','issues']);
    GroupSearchDispatcher.dispatch({
      type: 'INIT',
      findGroupsArgs: !_.isEmpty(args) ? args : null,
      searchSettings: {
        updateUrl: true
      }});
    TagDispatcher.dispatch({type: 'INIT'});
  }

  // TODO: Splash
  render(): React$Node {
    return (
      <React.Fragment>
        <Headers
          title="DemocracyLab"
          description="Optimizing the connection between skilled volunteers and tech-for-good groups"
        />
          <SplashScreen className="FindGroups-topsplash" header={"Tech-for-Good Groups"} img={HeroImage.TopLanding} doNotFillViewport>
            <Button variant="primary" className="FindGroups-splash-button" href={url.section(Section.FindGroups)}>
              Find Groups
            </Button>
            <Button variant="outline-primary" className="FindGroups-splash-button FindGroups-splash-button-create" href={url.sectionOrLogIn(Section.CreateGroup)}>
              Create A Group
            </Button>
          </SplashScreen>
          <div className="container">
            <div className="row">
              <GroupFilterContainer />
              <GroupCardsContainer showSearchControls={true}/>
            </div>
          </div>
      </React.Fragment>
    );
  }

}

export default FindGroupsController;
