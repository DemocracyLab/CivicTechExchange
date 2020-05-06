// @flow

import React from 'react';
import Button from 'react-bootstrap/Button';
import CurrentUser from "../../utils/CurrentUser.js";
import {EventData} from "../../utils/EventAPIUtils.js";
import urlHelper from "../../utils/url.js";
import Section from "../../enums/Section";


type Props = {|
  event: ?EventData,
  viewOnly: boolean
|};

type State = {|
  event: ?EventData
|};

class AboutEventDisplay extends React.PureComponent<Props, State> {
  constructor(props: Props): void{
    super();
    this.state = {
      event: props.event
    };
 }

  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.event !== this.props.event) {
      this.setState({
        event: nextProps.event
      });
    }
  }
  
  render(): ?$React$Node {
    const event:EventData = this.state.event;
    return !event ? null : (
      <div className='AboutProjects-root'>
        <div className="AboutProjects-mainColumn">
          <div className='AboutProjects-intro'>
            <div className='AboutProjects-introTop'>
              <div className='AboutProjects-description'>
                {/*TODO: Date h3*/}
                <h1>{event.event_name}</h1>
              </div>
            </div>
          </div>
          
          <div className="AboutEvent-EventBanner">
            <div className="AboutEvent-Info">
              {/*TODO: Date and Location Info*/}
              {!this.props.viewOnly && this._renderJoinLiveEventButton()}
            </div>
            <div className="AboutEvent-Splash">
              <div className='AboutProjects-iconContainer'>
                <img className='AboutProjects-icon' src={event.event_thumbnail.publicUrl} />
              </div>
            </div>
          </div>

          <div className='AboutProjects-details AboutProjects-details-description'>
            <div className="position-relative"><a className="position-absolute AboutProjects-jumplink" id="project-details" name="project-details"></a></div>
            <div>

              <h3>Details</h3>
              <div>
                <br></br>
                {event.event_short_description}
              </div>
              <div>
                <br></br>
                {event.event_description}
              </div>
              <h3>What We Will Do</h3>
              <div>
                <br></br>
                {event.event_agenda}
              </div>
            </div>
          </div>
          {/*TODO: Show projects*/}

        </div>

      </div>
    )
  }
  
  _renderJoinLiveEventButton() {
    let text: string = "";
    let url: string = "";
    if(CurrentUser.isLoggedIn()) {
      //TODO: Handle un-verified users
      text = "Join Event";
      url = urlHelper.section(Section.LiveEvent);
    } else {
      text = "Log In to Join Event";
      url = urlHelper.logInThenReturn();
    }
    
    return (
      <Button
        variant="primary"
        className="AboutProject-button"
        type="button"
        title={text}
        href={url}
      >
        {text}
      </Button>
    );
  }
  
}

export default AboutEventDisplay;
