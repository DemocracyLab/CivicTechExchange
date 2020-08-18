// @flow

import React from 'react';
import Headers from "../common/Headers.jsx";
import ContactForm from "../forms/ContactForm.jsx";
import prerender from "../utils/prerender.js";
import url from "../utils/url.js";
import Button from "react-bootstrap/Button";
import Section from "../enums/Section";
import Ch1Icon from "../svg/corporatehackathon/one.svg";
import Ch2Icon from "../svg/corporatehackathon/two.svg";
import Ch3Icon from "../svg/corporatehackathon/three.svg";
import cdn from "../utils/cdn.js";



class CorporateHackathonController extends React.PureComponent<{||}> {
  componentDidMount() {
    prerender.ready();
  }

  _renderHeader(): React$Node {
    const title: string = "DemocracyLab | Corporate Hackathons";
    const description: string = "Host a hackathon with DemocracyLab!"

    return (
      <Headers
        title={title}
        description={description}
      />
    );
  }

   render(): $React$Node {
     return (
       <React.Fragment>
        {this._renderHeader()}
         <div className="container corporate-hackathon-root">
          {this._hostWithUs()}
          {this._howItWorks()}
          {this._whyEngage()}
          {this._strengthenTeam()}
          {this._hackathonSponsorships()}
         </div>
       </React.Fragment>
     )
   }

  _hostWithUs(): $React$Node {
    return (
      <div className="corporate-hackathon-hostwithus">
        <h1>Host a hackathon with us!</h1>
        <p>Create a unique employee engagement experience and deliver instant-impact tech projects.</p>
        <Button variant="primary">Get Started</Button>
        <div><p> img goes here</p></div>
        <h2>Public Hackathon Results</h2>
        <div className="corporate-hackathon-hostwithus-results">
          <div className="corporate-hackathon-hostwithus-results-item">
            <h3>$1 million +</h3>
            <p>Public Value Created</p>
          </div>
          <div className="corporate-hackathon-hostwithus-results-item">
            <h3>1200</h3>
            <p>Volunteers</p>
          </div>
          <div className="corporate-hackathon-hostwithus-results-item">
            <h3>100 +</h3>
            <p>Projects</p>
          </div>
          <div className="corporate-hackathon-hostwithus-results-item">
            <h3>100</h3>
            <p>Average Attendees/Event</p>
          </div>
        </div>
      </div>
    )
  }
  _howItWorks(): $React$Node {
    return (
      <div className="corporate-hackathon-howitworks">
        <h2>How it works</h2>
        <p>As soon as you have signed up for a hackathon, the DemocracyLab team gets right to work on finding non-profits in need of tech volunteers. You can focus on team building; we’ll get everything set up with your specific goals in mind. There are just a few things we need from you!</p>
        <div className="corporate-hackathon-howitworks-one">
          <img src={cdn.image("recruit-icon.png")} alt="Recruit"/>
          <p><Ch1Icon /> Recruit</p>
          <p>Encourage your employees to sign up for the hackathon! We’ll find non-profits with needs that are a good fit for your team.</p>
        </div>
        <div className="corporate-hackathon-howitworks-two">
          <img src={cdn.image("define-icon.png")} alt="Define"/>
          <p><Ch2Icon /> Define</p>
          <p>We’ll work with the non-profits to identify achievable, instant-impact projects that are ready for your team, then connect you with the non-profit team to define the scope.</p>
        </div>
        <div className="corporate-hackathon-howitworks-three">
          <img src={cdn.image("hack-icon.png")} alt="Hack"/>
          <p><Ch3Icon /> Hack</p>
          <p>We’ll work with the non-profits to identify achievable, instant-impact projects that are ready for your team, then connect you with the non-profit team to define the scope.</p>
        </div>
        <p>Once the hackathon is finished, you’re all done! Your team can get back to work and enjoy renewed enthusiasm and deeper engagement. DemocracyLab will survey both volunteers and project owners to provide you a clear summary of the outcomes and impacts of the event.</p>
      </div>
    )
  }
  _whyEngage(): $React$Node {
    return (
      <div className="corporate-hackathon-whyengage">
        <h2>Why Engage?</h2>
        <p>Create a unique employee engagement experience and deliver instant-impact tech projects.</p>
        <ul>
          <li>
            <h3>Build Company Culture</h3>
            <p>Hackathons cultivate an open, agile company culture centered on innovation, flexibility, and idea sharing, even between positions and unrelated departments.</p>
          </li>
          <li>
            <h3>Nurture innovation</h3>
            <p>Corporate hackathons allow employees the opportunity to take risks, try bold new strategies, and share their knowledge and experience with others in a low-pressure environment.</p>
          </li>
          <li>
            <h3>Create positive public relations</h3>
            <p>Companies that participate in hackathons show themselves to be drivers of change in their industry and community, to both their employees and the public.</p>
          </li>
        </ul>
        <div className="corporate-hackathon-whyengage-source">Source: “<a href="https://link.springer.com/chapter/10.1007/978-3-030-35333-9_27" target="_blank" rel="nofollow noopener">On the Benefits of Corporate Hackathons for Software Ecosystems - A Systemic Mapping Study</a>”</div>
        <div><p> img goes here </p></div>
      </div>
    )
  }
  _strengthenTeam(): $React$Node {
    return (
      <div className="corporate-hackathon-strengthen">
      <h2>Strengthen your team while supporting the acceleration of social change.</h2>
      <Button variant="secondary">Get Started</Button>
      </div>
    )
  }

  _hackathonSponsorships(): $React$Node {
    return (
      <div className="corporate-hackathon-sponsorships">
        <h2>Public Hackathon Sponsorships: Another Way To Engage</h2>
        <div><p> img goes here </p></div>
        <div className="corporate-hackathon-sponsorships-text">
          <h3>Event Sponsorship</h3>
          <h4>Starting at $500 per event</h4>
          <p>Not ready to host? Sponsor one of our public hackathons! Your sponsorship will help us drive innovation, support non-profits and civic tech organizations, and promote your brand before, during, and after the event!</p>
          <Button variant="primary" href={url.section(Section.PartnerWithUs)}>Learn More</Button>
        </div>
      </div>
    )
  }

}

export default CorporateHackathonController;
