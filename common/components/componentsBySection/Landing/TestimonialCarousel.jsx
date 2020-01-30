import React from 'react';
import Testimonials from './Testimonials.jsx';
import Carousel from 'react-bootstrap/Carousel';
import Person from '@material-ui/icons/Person';

const carouselItems = Testimonials.map((i) =>
  <Carousel.Item className="carousel-item">
    {i.avatar ? <img src={i.avatar} alt={i.name} className="carousel-avatar"></img> : null}
    <h3>{i.name}</h3>
    <h4>{i.role}, {i.project}</h4>
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
