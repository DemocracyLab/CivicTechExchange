// @flow

import React from "react";
// import EventFilterDataContainer from "./EventFilterDataContainer.jsx";
// import ResetEventSearchButton from "./ResetEventSearchButton.jsx";

class EventFilterContainer extends React.PureComponent<{||}> {
  render(): React$Node {
    return (
      <div className="EventFilterContainer-root col-12 col-md-4 col-lg-3 pl-0 pr-0"></div>
    );
  }
}

// enable this when we enable filters
// return (
//   <div className="EventFilterContainer-root col-12 col-md-4 col-lg-3 pl-0 pr-0">
//     <div className="EventFilterContainer-reset">
//       <ResetEventSearchButton />
//     </div>
//       <EventFilterDataContainer />
//   </div>

export default EventFilterContainer;
