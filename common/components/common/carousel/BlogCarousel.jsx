import React from "react";
import Carousel from "react-bootstrap/Carousel";

//props.interval is optional, default 6000ms
//props.items is required (otherwise it renders nothing)

//this carousel is designed to pull from DemocracyLab's ghost blog

class BlogCarousel extends React.PureComponent {
  constructor(props) {
    super();
  }

  render(): React$Node {
    return (
      <Carousel interval={this.props.interval ? this.props.interval : 6000}>
        {this.props.items.map(i => (
          <Carousel.Item className="carousel-item" key={i.slug}>
            <div className="carousel-item-content">
              <div className="carousel-feature-image">
                <img src={i.feature_image} alt={i.title} />
              </div>
              <h3>{i.title}</h3>
              <p>{i.custom_excerpt ? i.custom_excerpt : i.excerpt}</p>
              <a href={i.url}>Read More</a>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }
}

export default BlogCarousel;
