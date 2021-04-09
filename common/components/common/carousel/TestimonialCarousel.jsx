import React from "react";
import Carousel from "react-bootstrap/Carousel";

let testimonialItems = this.props.items;

const carouselItems = testimonialItems.map(i => (
  <Carousel.Item className="carousel-item" key={i.name}>
    <div className="carousel-item-content">
      <div className="carousel-item-left">
        {i.avatar ? (
          <div
            className="carousel-avatar"
            style={{ backgroundImage: `url(${i.avatar})` }}
          ></div>
        ) : null}
      </div>
      <div className="carousel-item-right">
        <h3>{i.name}</h3>
        <h4>{i.title}</h4>
        <span className="carousel-spacer"></span>
        <p>"{i.text}"</p>
      </div>
    </div>
  </Carousel.Item>
));

class TestimonialCarousel extends React.PureComponent {
  render(): React$Node {
    return (
      <Carousel interval={this.props.interval ? this.props.interval : 6000}>
        {carouselItems}
      </Carousel>
    );
  }
}

export default TestimonialCarousel;
