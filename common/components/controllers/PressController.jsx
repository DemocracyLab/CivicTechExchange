// @flow

import React from 'react';
import Headers from "../common/Headers.jsx";
import url from "../utils/url.js";
import Section from "../enums/Section.js";


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
        <p>Title</p>
      )
    }

    _renderStats(): React$Node {
      return (
        <p>Stats</p>
      )
    }
    _renderNews(): React$Node {
      return (
        <p>News</p>
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
