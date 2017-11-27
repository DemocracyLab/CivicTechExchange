import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

/**
 * Modal for adding/editing hyperlinks
 */
class LinkEntryModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      linkInfo: {
        linkUrl: "",
        linkName: ""
      }
    }
  
    this.close = this.close.bind(this);
    this.save = this.save.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  resetModal(url, name) {
    this.setState({ "linkInfo": {
      linkUrl: url || "",
      linkName: name || ""
    }});
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({ showModal: nextProps.showModal });
  
    if(nextProps.existingLink) {
      this.resetModal(nextProps.existingLink.linkUrl,nextProps.existingLink.linkName);
    } else {
      this.resetModal();
    }
  }
  
  close() {
    this.setState({showModal: false});
  }
  
  save() {
    //Sanitize link
    this.state.linkInfo.linkUrl = this.sanitizeUrl(this.state.linkInfo.linkUrl);
    
    this.props.onSaveLink(this.state.linkInfo);
    this.close();
  }
  
  // TODO: Put this in a common library
  sanitizeUrl(url) {
    // TODO: Find a library that can handle this so we don't have to maintain regexes
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    return url;
  }
  
  handleChange(event, propertyName) {
    this.state.linkInfo[propertyName] = event.target.value;
    this.forceUpdate();
  }
  
  render() {
    return (
      <div>
          <Modal show={this.state.showModal}
                 onHide={this.close}
                 backdrop="true"
          >
              <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <label for="link-url">Link URL</label>
                  <input type="text" class="form-control" id="link-url" value={this.state.linkInfo.linkUrl} onChange={(e) => this.handleChange(e, "linkUrl")}/>
                  <label for="link-name">Link Name</label>
                  <input type="text" class="form-control" id="link-name" value={this.state.linkInfo.linkName} onChange={(e) => this.handleChange(e, "linkName")}/>
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.close}>Close</Button>
                  <Button onClick={this.save}>Save</Button>
              </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

LinkEntryModal.propTypes = {
  /** True to show modal, false to hide */
  showModal: PropTypes.bool,
  /**
   * Properties of the link we are editing
   */
  linkInfo: PropTypes.shape({
    linkUrl: PropTypes.string,
    linkName: PropTypes.string
  })
};

export default LinkEntryModal;
