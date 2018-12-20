// @flow

import React from 'react';
import {PositionInfo} from "../../forms/PositionInfo.jsx";

type Props = {|
  +position: PositionInfo,
  +onClickApply: (PositionInfo) => void,
|}

class AboutPositionEntry extends React.PureComponent<Props> {
  
  render(): React$Node {
    return (
      <div>
        {this._renderHeader()}
        <div className="Text-section" style={{whiteSpace: "pre-wrap"}}>
          {this.props.position.description}
        </div>
      </div>
    );
  }
  
  _renderHeader(): ?React$Node {
    return this.props.position.descriptionUrl
      ? 
        (<h3 className="form-group subheader">
          <a href={this.props.position.descriptionUrl}>
            {this.props.position.roleTag.display_name}
            </a>
        </h3>)
      :
        (<h3 className="form-group subheader">
          {this.props.position.roleTag.display_name}
        </h3>)
      ;
  }
}

export default AboutPositionEntry;
