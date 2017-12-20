// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import LinkEntryModal from './LinkEntryModal.jsx'
import type { LinkInfo } from './LinkInfo.jsx'
import _ from 'lodash'


type Props = {|
  links: string,
  elementid: string
|};
type State = {|
  showModal: boolean,
  existingLink: LinkInfo,
  links: Array<LinkInfo>
|};

/**
 * Lists hyperlinks and provides add/edit functionality for them
 */
class LinkList extends React.PureComponent<Props,State>  {
  editLink: Function;
  _renderLinks: Function;
  
  constructor(props: Props): void {
    super(props);
    this.state = {
      links: JSON.parse(this.props.links),
      showModal: false,
      existingLink: null
    };
    
    this.editLink = this.editLink.bind(this);
    this._renderLinks = this._renderLinks.bind(this);
  }

  createNewLink(): void {
    this.state.existingLink = null;
    this.openModal();
  }
  
  onModalCancel(): void {
    this.setState({showModal: false})
  }
  
  editLink(linkData: LinkInfo): void {
    this.state.existingLink = linkData;
    this.openModal();
  }
  
  saveLink(linkData: LinkInfo): void {
    if(!this.state.existingLink) {
      this.state.links.push(linkData);
    } else {
      _.assign(this.state.existingLink, linkData);
    }
  
    this.setState({showModal: false});
    this.updateLinkField();
  }
  
  updateLinkField(): void {
    this.refs.hiddenFormField.value = JSON.stringify(this.state.links);
  }

  openModal(): void {
    this.setState({showModal: true});
  }
  
  render(): React$Node {
    return (
      <div>
        <input type="hidden" ref="hiddenFormField" id={this.props.elementid} value={this.state.links}/>
        
        {this._renderLinks()}
        
        <Button
            bsStyle="primary"
            bsSize="large"
            onClick={this.createNewLink.bind(this)}
        >
          Add
        </Button>

        <LinkEntryModal showModal={this.state.showModal}
          existingLink={this.state.existingLink}
          onSaveLink={this.saveLink.bind(this)}
          onCancelLink={this.onModalCancel.bind(this)}
        />
      </div>
    );
  }
  
  _renderLinks(): Array<React$Node> {
    return this.state.links.map(link =>
      <div>
        <a href={link.linkUrl}>{link.linkName}</a>
        <i class="fa fa-pencil-square-o fa-1" aria-hidden="true" onClick={(e) => this.editLink(link)}></i>
      </div>
    );
  }
}

export default LinkList;
