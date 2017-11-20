import IssueArea from '../../enums/IssueArea.js';
import IssueAreaDropDownItem from './IssueAreaDropDownItem.jsx';
import React from 'react';

class IssueAreaDropDown extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      contextualArrowX: 0,
    };
  }

  render() {
    return (
      <div
        className="IssueAreaDropDown-root"
        ref={this._onDropDownMount.bind(this)}
        style={{left: this.props.xPos}}>
        {this._renderContextualArrow()}
        {this._renderIssueAreas()}
      </div>
    );
  }

  _onDropDownMount(dropDownElement) {
    const contextualArrowX = dropDownElement
      ? dropDownElement.getBoundingClientRect().width / 2
      : 0;
    this.setState({contextualArrowX});
  }

  _renderIssueAreas() {
    return Object.keys(IssueArea)
      .map(issueArea =>
        <IssueAreaDropDownItem issueArea={issueArea} key={issueArea}/>
      );
  }

  _renderContextualArrow() {
    return (
      <div
        className="IssueAreaDropDown-contextualArrow"
        style={{left: this.state.contextualArrowX}}
      />
    );
  }
}

export default IssueAreaDropDown;
