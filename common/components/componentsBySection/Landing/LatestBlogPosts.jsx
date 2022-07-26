import React from "react";
import { ghostApiRecent, GhostPost } from "../../utils/ghostApi.js";
import LoadingFrame from "../../chrome/LoadingFrame.jsx";

//props.interval is optional, default 6000ms
//props.tag filters blog posts to show
type Props = {|
  interval: number,
  tag: string,
|};

type State = {|
  ghostPosts: $ReadOnlyArray<GhostPost>,
|};

//this carousel is designed to pull from DemocracyLab's ghost blog
class BlogCarousel extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = { ghostPosts: null };
  }

  componentDidMount() {
    ghostApiRecent && ghostApiRecent.browse(this.loadGhostPosts.bind(this));
  }

  loadGhostPosts(ghostPosts: $ReadOnlyArray<GhostPost>): void {
    this.setState({ ghostPosts: ghostPosts });
  }

  render(): React$Node {
    const ghostPosts: $ReadOnlyArray<GhostPost> = this.state.ghostPosts;
    return ghostPosts ? (
      <React.Fragment>
        {console.log(ghostPosts)}
        {ghostPosts.map(i => (
          <div key={i.slug} className="LatestBlogPosts-post">
            {/* <div className="carousel-item-content">
              <div className="carousel-feature-image">
                <img src={i.feature_image} alt={i.title} />
              </div> */}
              <h3>{i.title}</h3>
              {/* <p>{i.custom_excerpt ? i.custom_excerpt : i.excerpt}</p>
              <div className="text-center">
                <a href={i.url} className="carousel-link" target="_blank">
                  Read More
                </a>
              </div>
            </div> */}
          </div>
        ))}
      </React.Fragment>
    ) : (
      <LoadingFrame height="300px" />
    );
  }
}

export default BlogCarousel;
