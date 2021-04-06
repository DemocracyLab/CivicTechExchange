// @flow

import React from "react";
import Headers from "../common/Headers.jsx";
import prerender from "../utils/prerender.js";
import url from "../utils/url.js";
import Button from "react-bootstrap/Button";
import Section from "../enums/Section";
import Ch1Icon from "../svg/corporatehackathon/one.svg";
import Ch2Icon from "../svg/corporatehackathon/two.svg";
import Ch3Icon from "../svg/corporatehackathon/three.svg";
import cdn from "../utils/cdn.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

class CorporateHackathonController extends React.PureComponent<{||}, State> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    prerender.ready();
  }
  //TODO: Get headers from the back end, see PR #446 for example of the change
  _renderHeader(): React$Node {
    const title: string = "DemocracyLab | Corporate Hackathons";
    const description: string = "Host a hackathon with DemocracyLab!";

    return <Headers title={title} description={description} />;
  }

  render(): $React$Node {
    return (
      <React.Fragment>
        {this._renderHeader()}
        <div className="corporate-root container">
          <div className="row">
              {this._renderTop()}
              {this._renderTabs()}
              {this._renderContact()}
              {this._renderBottomImage()}
          </div>
        </div>
      </React.Fragment>
    );
  }

  //TODO: maybe build a reusable anchor component that reads the nav height for an offset value?
  _renderTop(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section col-12">
          <p>top section</p>
          <Button variant="cta" href="#contact">
            Partner With Us
          </Button>
        </div>
      </React.Fragment>
    );
  }

  //TODO: make tabs look at URL querystring to open sponsorship when needed
  _renderTabs(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section col-12">
        <p>tabs container</p>
        <Tabs defaultActiveKey="tab-hackathon" id="corporate-tabs">
          <Tab eventKey="tab-hackathon" title="Host a Hackathon">
            <p>Hackathon tab content</p>
          </Tab>
          <Tab eventKey="tab-sponsorship" title="Sponsorship">
            <p>Sponsorship tab content</p>
          </Tab>
        </Tabs>
        </div>
      </React.Fragment>
    );
  }

  _renderContact(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section col-12">
        <a id="contact"></a>
        <p>contact us/take the first step section</p>
        </div>
      </React.Fragment>
    );
  }

  _renderBottomImage(): React$Node {
    return (
      <React.Fragment>
        <div className="corporate-section col-12">
        <p>bottom image with a gradient fade on the top edge</p>
        </div>
      </React.Fragment>
    );
  }
}

export default CorporateHackathonController;
