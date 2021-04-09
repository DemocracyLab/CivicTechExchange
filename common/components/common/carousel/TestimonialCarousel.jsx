import React from "react";
import Carousel from "react-bootstrap/Carousel";

//props.interval is optional, default 6000ms
//props.items is required (otherwise it renders nothing)

class TestimonialCarousel extends React.PureComponent {
  constructor(props) {
    super();
  }

  render(): React$Node {
    return (
      <Carousel interval={this.props.interval ? this.props.interval : 6000}>
        {this.props.items.map(i => (
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
        ))}
      </Carousel>
    );
  }
}

export default TestimonialCarousel;
