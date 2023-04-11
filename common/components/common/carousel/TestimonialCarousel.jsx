import React from "react";
import Carousel from "react-bootstrap/Carousel";
import ProjectAPIUtils, { Testimonial } from "../../utils/ProjectAPIUtils.js";
import LoadingFrame from "../../chrome/LoadingFrame.jsx";

//props.interval is optional, default 6000ms
//props.category is optional, default shows all testimonials
type Props = {|
  category: string,
|};

type State = {|
  testimonials: $ReadOnlyArray<Testimonial>,
|};

class TestimonialCarousel extends React.PureComponent<Props, State> {
  constructor(props) {
    super();
    this.state = { testimonials: null };
  }

  componentDidMount() {
    ProjectAPIUtils.fetchTestimonials(
      this.props.category,
      this.loadTestimonials.bind(this)
    );
  }

  loadTestimonials(testimonials: $ReadOnlyArray<Testimonial>): void {
    this.setState({ testimonials: testimonials });
  }

  render(): ?React$Node {
    const testimonials: $ReadOnlyArray<Testimonial> = this.state.testimonials;
    return testimonials ? (
      // <Carousel interval={this.props.interval ? this.props.interval : null}>
      <Carousel interval={null}>
        {testimonials.map(i => (
          <Carousel.Item className="carousel-item" key={i.name}>
            <div className="carousel-item-content">
              <div className="carousel-item-left">
                {i.avatar_url ? (
                  <div
                    className="carousel-avatar"
                    style={{ backgroundImage: `url(${i.avatar_url})` }}
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
    ) : (
      <LoadingFrame height="300px" />
    );
  }
}

export default TestimonialCarousel;
