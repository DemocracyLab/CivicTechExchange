import React from 'react';
import Testimonials from './Testimonials.jsx';
import Carousel from 'react-bootstrap/Carousel';

const carouselItems = Testimonials.map((i) =>
  <Carousel.Item className="carousel-item">
    <h3>{i.name}</h3>
    <h4>{i.project}</h4>
    <p>{i.text}</p>
  </Carousel.Item>
);

class TestimonialCarousel extends React.PureComponent {
  render(): React$Node {
    return (
      <Carousel>{carouselItems}</Carousel>
    )
  }
}

export default TestimonialCarousel;
