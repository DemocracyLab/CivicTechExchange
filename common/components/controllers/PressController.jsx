// @flow

import React from 'react';
import Headers from "../common/Headers.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section.js";

//TEMPORARY DATA FOR TESTING//
//date field may need to be changed, represented as a literal string right now but should be something Moment/etc could handle
//Month Day, Year
const pressLinks = [
  {
    date: "March 11, 2019",
    href: "https://www.washingtontechnology.org/the-pulse-of-tech-for-good-in-seattle/",
    title: "The Pulse of Tech for Good in Seattle",
    source: "Washington Technology Industry Association"
  },
  {
    date: "February 10, 2019",
    href: "https://www.esal.us/blog/democracylab-empowering-the-civic-tech-movement/",
    title: "DemocracyLab: Empowering the Civic Tech Movement",
    source: "Engineers and Scientists Acting Locally"
  },
  {
    date: "January 22, 2019",
    href: "https://givingcompass.org/article/untapped-potential-of-civic-technology/",
    title: "The Untapped Potential of Civic Technology",
    source: "Giving Compass"
  },
  {
    date: "January 18, 2019",
    href: "http://techtalk.seattle.gov/2019/01/18/civic-tech-community-tackles-pressing-issues-with-seattles-open-data/",
    title: "Civic Tech Community Tackles Pressing Issues with Seattle’s Open Data",
    source: "Seattle IT Tech Talk Blog"
  },
  {
    date: "January 9, 2019",
    href: "https://socrata.com/blog/seattle-hackathon-real-world-impact/",
    title: "Seattle Hackathon Innovates for ‘Real World Impact’",
    source: "Socrata Blog"
  },
  {
    date: "August 8, 2018",
    href: "https://www.geekwire.com/2018/can-tech-government-innovate-together-social-good-inside-new-effort-change-tide/",
    title: "Can tech and government innovate together for social good? Inside a new effort to change the tide",
    source: "GeekWire"
  }
]

class PressController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {}
  }



  _renderHeader(): React$Node {
    const title: string = "DemocracyLab | Press";
    const description: string = "Read external articles and blog posts describing DemocracyLab's work."

    return (
        <Headers
          title={title}
          description={description}
        />
      );
    }

    _renderTitle(): React$Node {
      return (
        <div className="press-title">
          <h1>Press</h1>
          <p>For press opportunities, please contact hello@democracylab.org</p>
        </div>
      )
    }

    _renderStats(): React$Node {
      return (
        <p>Stats</p>
      )
    }
    _renderNews(): React$Node {
      return (
        <div className="press-in-media">
        <h2>In the media</h2>
        {pressLinks.map((item, i) => {
          return (
            <div className="press-presslink" key={i}>
              <p>{item.date}</p>
              <h4><a href={item.href} alt={item.source + ' - ' + item.title}>{item.title}</a></h4>
            </div>
          )})}
        </div>
      )
    }

   render(): $React$Node {
     return (
       <React.Fragment>
         {this._renderHeader()}
         <div className="container-fluid pl-0 pr-0 press-root">
           {this._renderTitle()}
           {this._renderStats()}
         </div>
         <div className="container pl-0 pr-0 press-root">
           {this._renderNews()}
         </div>
     </React.Fragment>
     )
   }
}

export default PressController;
