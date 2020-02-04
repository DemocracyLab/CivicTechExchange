import React from 'react';
import Testimonials from './Testimonials.jsx';
import Carousel from 'react-bootstrap/Carousel';

const carouselItems = Testimonials.map((i) =>
  <Carousel.Item className="carousel-item" key={i.name}>
    <div className="carousel-item-content">
      <div className="carousel-item-left">
        {i.avatar ? <img src={i.avatar} alt={i.name} className="carousel-avatar"></img> : null}
      </div>
      <div className="carousel-item-right">
        <h3>{i.name}</h3>
        <h4>{i.role}, {i.project}</h4>
        <span className="carousel-spacer"></span>
        <p>"{i.text}"</p>
      </div>
    </div>
  </Carousel.Item>
);

class TestimonialCarousel extends React.PureComponent {
  render(): React$Node {
    return (
      <Carousel interval={this.props.interval ? this.props.interval : 6000}>{carouselItems}</Carousel>
    )
  }
}

export default TestimonialCarousel;
