// @flow

import React from "react";
import Modal from "react-bootstrap/Modal";
import _ from "lodash";
import type { BioPersonData } from "./BioPersonData.jsx";
import utils from "../../utils/utils.js";
import url from "../../utils/url.js";
import Section from "../../enums/Section.js";

type Props = {|
  showModal: boolean,
  person: BioPersonData,
  allowUnsafeHtml: boolean,
  size: string,
  handleClose: () => void,
|};
type State = {|
  showModal: boolean,
|};

/* Modal for showing user biography details */
class BioModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
    };
    this.closeModal = this.closeModal.bind(this);
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return { showModal: nextProps.showModal };
  }

  closeModal(): void {
    this.setState({ showModal: false });
    this.props.handleClose();
  }

  render(): ?React$Node {
    if (this.props.person) {
      return (
        <div>
          <Modal
            show={this.state.showModal}
            onHide={this.closeModal}
            size={this.props.size}
            className="bio-modal-root"
          >
            <Modal.Header closeButton>
              <div className="bio-modal-nametitle-container">
                {this._renderBioName()}
                {this.props.person.title.map((title, i) => (
                  <h4 className="bio-modal-title" key={i}>
                    {title}
                  </h4>
                ))}
              </div>
            </Modal.Header>
            <Modal.Body style={{ whiteSpace: "pre-wrap" }}>
              <h4 className="bio-modal-about">About</h4>
              {this._renderBody()}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={this.closeModal} className="btn btn-secondary">
                Close
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } else return null;
  }

  _renderBody(): React$Node {
    const bio: string = !_.isEmpty(this.props.person.bio_text)
      ? this.props.person.bio_text
      : this.defaultBiography();
    return (
      <React.Fragment>
        {this.props.allowUnsafeHtml ? (
          <div
            dangerouslySetInnerHTML={{
              __html: "<p>" + utils.unescapeHtml(bio) + "</p>",
            }}
          />
        ) : (
          <p>{bio}</p>
        )}
      </React.Fragment>
    );
  }

  _renderBioName(): React$Node {
    return (
      <h3 className="bio-modal-name">
        {this.props.person.profile_id ? (
          <a
            href={url.section(Section.Profile, {
              id: this.props.person.profile_id,
            })}
          >
            {this.props.person.first_name} {this.props.person.last_name}
          </a>
        ) : (
          <React.Fragment>
            {" "}
            {this.props.person.first_name} {this.props.person.last_name}
          </React.Fragment>
        )}
      </h3>
    );
  }

  defaultBiography(): void {
    return `${this.props.person.first_name} ${this.props.person.last_name} is contributing their talents to DemocracyLab, helping to empower a community of people and projects that use technology to advance the public good.`;
  }
}

export default BioModal;
