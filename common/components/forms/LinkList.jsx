import React from 'react';
import {Button} from 'react-bootstrap';
import LinkEntryModal from './LinkEntryModal.jsx'

/**
 * Lists hyperlinks and provides add/edit functionality for them
 */
class LinkList extends React.PureComponent {
  constructor(props) {
    super(props);
    var initialValue = document.getElementById(this.props.elementid).value;
    this.state = {
      linkList: JSON.parse(initialValue)
    };
    
    this.createNewLink = this.createNewLink.bind(this);
    this.editLink = this.editLink.bind(this);
    this.saveLink = this.saveLink.bind(this);
    this._renderLinks = this._renderLinks.bind(this);
  }

  createNewLink() {
    this.state.existingLink = null;
    this.openModal();
  }
  
  editLink(linkData) {
    this.state.existingLink = linkData;
    this.openModal();
  }
  
  saveLink(linkData) {
    if(!this.state.existingLink) {
      this.state.linkList.push(linkData);
    } else {
      _.assign(this.state.existingLink, linkData);
    }
  
    this.setState({showModal: false});
    this.updateLinkField();
  }
  
  updateLinkField() {
    document.getElementById(this.props.elementid).value = JSON.stringify(this.state.linkList);
  }

  openModal() {
    // If showModal is already true and we set it here, the change won't be passed onto the Modal child component
    // TODO: Find less cleaner way to handle this.
    this.state.showModal = false;
    this.setState({showModal: true});
  }
  
  render() {
    return (
      <div>
        {this._renderLinks()}
        
        <Button
            bsStyle="primary"
            bsSize="large"
            onClick={this.createNewLink}
        >
          Add
        </Button>

        <LinkEntryModal showModal={this.state.showModal}
          existingLink={this.state.existingLink}
          onSaveLink={this.saveLink}
        />
      </div>
    );
  }
  
  _renderLinks() {
    return this.state.linkList.map(link =>
      <div>
        <a href={link.linkUrl}>{link.linkName}</a>
        <i class="fa fa-pencil-square-o fa-1" aria-hidden="true" onClick={(e) => this.editLink(link)}></i>
      </div>
    );
  }
}

export default LinkList;
