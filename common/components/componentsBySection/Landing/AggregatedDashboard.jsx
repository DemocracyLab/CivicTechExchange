// AggregatedDashboard.js

// import React from 'react';

// const AggregatedDashboard = () => {
//   return (
//     <div className="aggregated-dashboard">
//       <div className="card">
//         <h3>Card 1</h3>
//         <p>Static Number: 10</p>
//       </div>
//       <div className="card">
//         <h3>Card 2</h3>
//         <p>Static Number: 20</p>
//       </div>
//       <div className="card">
//         <h3>Card 3</h3>
//         <p>Static Number: 30</p>
//       </div>
//       <div className="card">
//         <h3>Card 4</h3>
//         <p>Static Number: 40</p>
//       </div>
//     </div>
//   );
// };

// export default AggregatedDashboard;

import React from "react";
import { ghostApiRecent, GhostPost } from "../../utils/ghostApi.js";
import LoadingFrame from "../../chrome/LoadingFrame.jsx";
import Moment from "react-moment";

//props.interval is optional, default 6000ms
//props.tag filters blog posts to show
type Props = {|
//   tag: string,
|};

type State = {|
//   ghostPosts: $ReadOnlyArray<GhostPost>,
|};

//this carousel is designed to pull from DemocracyLab's ghost blog
class AggregatedDashboard extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    // this.state = { ghostPosts: null };
    this.state = { };
  }

  componentDidMount() {
    // ghostApiRecent && ghostApiRecent.browse(this.loadGhostPosts.bind(this));
  }

//   loadGhostPosts(ghostPosts: $ReadOnlyArray<GhostPost>): void {
//     this.setState({ ghostPosts: ghostPosts });
//   }

  render(): React$Node {
    // const ghostPosts: $ReadOnlyArray<GhostPost> = this.state.ghostPosts;
    return (
      <React.Fragment>
        <h2 className="text-center AggregatedDashboard-title">DemocarcyLab's Impact</h2>
        <div className="Aggregated-dashboard">
            <div className="card">
                <span>4099%</span>
                <h4>Return of Impact</h4>
            </div>
            <div className="card">
                <span>$12M</span>
                <h4>Dollars Saved</h4>
            </div>
            <div className="card">
                <span>386</span>
                <h4>Active Volunteers</h4>
            </div>
            <div className="card">
                <span>87</span>
                <h4>Active Projects</h4>
            </div>
        </div>
        <button className="text-center AggregatedDashboard-button">
            View More
        </button>
        {/* <div className="LatestBlogPosts-container">
          {ghostPosts.map(i => (
            <div key={i.slug} className="LatestBlogPosts-post">
              <img
                className="LatestBlogPosts-featureimage"
                src={i.feature_image}
                alt={i.title}
                aria-hidden="true"
              />
              <p className="LatestBlogPosts-primarytag overline">
                {i.primary_tag?.name}
              </p>
              <h3 className="LatestBlogPosts-title">{i.title}</h3>
              <p className="LatestBlogPosts-excerpt">
                {i.custom_excerpt ? i.custom_excerpt : i.excerpt}{" "}
                {
                  <a href={i.url} target="_blank">
                    Read More
                  </a>
                }
              </p>
              <div className="LatestBlogPosts-bottomrow">
                <div className="LatestBlogPosts-authorblock">
                  <img
                    className="LatestBlogPosts-author-avatar"
                    src={i.primary_author.profile_image}
                    aria-hidden="true"
                  />
                  <div className="LatestBlogPosts-postinfo overline">
                    <span className="LatestBlogPosts-author">
                      {i.primary_author.name}
                    </span>
                    <span>
                      <Moment format="D MMM YYYY">
                        {i.updated_at ? i.updated_at : i.published_at}
                      </Moment>{" "}
                      &bull; {i.reading_time} min read
                    </span>
                  </div>
                </div>
                <div className="LatestBlogPosts-link"></div>
              </div>
            </div>
          ))}
        </div> */}
      </React.Fragment>
    );
  }
}

export default AggregatedDashboard;
