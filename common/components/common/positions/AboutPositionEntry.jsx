// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import {PositionInfo} from "../../forms/PositionInfo.jsx";
import CollapsibleTextSection from "../CollapsibleTextSection.jsx";
import {tagOptionDisplay} from "../tags/TagSelector.jsx";

type Props = {|
  +position: PositionInfo,
  +onClickApply: (PositionInfo) => void
|}

class AboutPositionEntry extends React.PureComponent<Props> {
  
  handleClickApply(): void {
    this.props.onClickApply(this.props.position);
  }
  
  render(): React$Node {
    return (
      <div className="Position-entry">
        {this._renderHeader()}
        {this.props.onClickApply ? this._renderApplyButton() : null}
        <div className="Text-section" style={{whiteSpace: "pre-wrap"}}>
          <CollapsibleTextSection
            text={this.props.position.description}
            expanded={false}
            maxCharacters={200}
            maxLines={3}
          />
        </div>
      </div>
    );
  }
  
  _renderApplyButton(): ?React$Node {
    return (
      <div className="apply-position-button">
        <Button
          className="ProjectSearchBar-submit"
          type="button"
          title="Apply to this position"
          onClick={this.handleClickApply.bind(this)}
        >
          Apply Now
        </Button>
      </div>
    );
  }
  
  _renderHeader(): ?React$Node {
    const headerText: string = tagOptionDisplay(this.props.position.roleTag);
    return this.props.position.descriptionUrl
      ? 
        (<h3 className="form-group subheader">
          <a href={this.props.position.descriptionUrl}>
            {headerText}
          </a>
        </h3>)
      :
        (<h3 className="form-group subheader">
          {headerText}
        </h3>)
      ;
  }
}

export default AboutPositionEntry;
