import React from "react";
import { ghostApiRecent, GhostPost } from "../../utils/ghostApi.js";
import LoadingFrame from "../../chrome/LoadingFrame.jsx";
import Moment from "react-moment";

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
      <div className="LatestBlogPosts-container">
        {console.log(ghostPosts)}
        {ghostPosts.map(i => (
          <div key={i.slug} className="LatestBlogPosts-post">
            <img
              className="LatestBlogPosts-featureimage"
              src={i.feature_image}
              alt={i.title}
              aria-hidden="true"
            />
            <p className="LatestBlogPosts-primarytag">{i.primary_tag.name}</p>
            <h3>{i.title}</h3>
            <p>{i.custom_excerpt ? i.custom_excerpt : i.excerpt}</p>
            <div className="LatestBlogPosts-authorblock">
              <img
                className="LatestBlogPosts-author-avatar"
                src={i.primary_author.profile_image}
                aria-hidden="true"
              />
              <div className="LatestBlogPosts-postinfo">
                <span>{i.primary_author.name}</span>
                <span>
                  <Moment format="D MMM YYYY">
                    {i.updated_at ? i.updated_at : i.published_at}
                  </Moment>{" "}
                  &bull; {i.reading_time} min read
                </span>
              </div>
            </div>

            <a href={i.url} target="_blank">
              Read More
            </a>
          </div>
        ))}
      </div>
    ) : (
      <LoadingFrame height="300px" />
    );
  }
}

export default BlogCarousel;
