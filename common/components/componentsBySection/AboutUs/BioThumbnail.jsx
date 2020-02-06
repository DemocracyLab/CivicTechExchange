// @flow

import React from 'react';
import Person from "@material-ui/core/SvgIcon/SvgIcon";
import type {BioPersonData} from "./BioPersonData.jsx";

type Props = {|
  person: BioPersonData,
  title: string,
  handleClick: () => BioPersonData
|};

class BioThumbnail extends React.PureComponent<Props> {
  constructor(props: Props): void {
    super(props);
  }

  handleClick(): BioPersonData {
    this.props.handleClick(this.props.person);
  }
  
  render(): React$Node {
    return this.props.person && (
      <div className="about-us-team-card" onClick={()=>this.handleClick()}>
        {this._renderAvatar()}
        <div className="about-us-team-card-title">
          <p className="about-us-team-card-name">{this.props.person.first_name} {this.props.person.last_name}</p>
          <p>{this.props.person.title}</p>
        </div>
      </div>
    );
  }
  
  _renderAvatar() {
    //modified version of common/components/common/avatar.jsx - to allow for variable sizing via CSS mediaquery instead of provided value as prop
    //TODO: Remove <Person> component from Material UI and have our own default avatar image or SVG
    return (
      this.props.person.user_thumbnail
        ? <div className="about-us-team-avatar" style={{backgroundImage: `url(${this.props.person.user_thumbnail})`}}></div>
        : (<div className="about-us-team-avatar-default">
          <Person className="PersonIcon"/>
        </div>)
    );
  }
}

export default BioThumbnail;
