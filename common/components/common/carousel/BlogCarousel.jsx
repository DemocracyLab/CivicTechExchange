import React from "react";
import Carousel from "react-bootstrap/Carousel";
import ghostApiHelper, { GhostPost } from "../../utils/ghostApi.js";
import LoadingFrame from "../../chrome/LoadingFrame.jsx";

//props.interval is optional, default 6000ms
//props.tag filters blog posts to show
type Props = {|
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
    ghostApiHelper &&
      ghostApiHelper.browse(this.props.tag, this.loadGhostPosts.bind(this));
  }

  loadGhostPosts(ghostPosts: $ReadOnlyArray<GhostPost>): void {
    this.setState({ ghostPosts: ghostPosts });
  }

  render(): React$Node {
    const ghostPosts: $ReadOnlyArray<GhostPost> = this.state.ghostPosts;
    return ghostPosts ? (
<Carousel>
        {ghostPosts.map(i => (
          <Carousel.Item className="carousel-item" key={i.slug}>
            <div className="carousel-item-content">
              <div className="carousel-feature-image">
                <img src={i.feature_image} alt={i.title} />
              </div>
              <h3>{i.title}</h3>
              <p>{i.custom_excerpt ? i.custom_excerpt : i.excerpt}</p>
              <div className="text-center">
                <a href={i.url} className="carousel-link" target="_blank">
                  Read More
                </a>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    ) : (
      <LoadingFrame height="300px" />
    );
  }
}

export default BlogCarousel;
