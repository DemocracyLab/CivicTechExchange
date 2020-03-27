// @flow
import React from 'react';
import Button from 'react-bootstrap/Button';
import {PositionInfo} from "../../forms/PositionInfo.jsx";
import {ProjectDetailsAPIData} from "../../utils/ProjectAPIUtils.js";
import CollapsibleTextSection from "../CollapsibleTextSection.jsx";
import {tagOptionDisplay} from "../tags/TagSelector.jsx";
import GlyphStyles from "../../utils/glyphs.js";
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import CurrentUser from '../../utils/CurrentUser';

type Props = {|
  +project: ProjectDetailsAPIData,
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
          <div className="Position-header">
          {this._renderHeader()}
          {!CurrentUser.isOwnerOrVolunteering(this.props.project) && this._renderApplyButton()}
          </div>
          { this.props.position.descriptionUrl &&
              <div className="Position-description-link"><a href={this.props.position.descriptionUrl} target="_blank" rel="noopener noreferrer">
                <i className={GlyphStyles.Globe}></i> Position description
              </a></div>
          }
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

    let applyButton;
    if (CurrentUser.canVolunteerForProject(this.props.project)) {
      applyButton = (
        <Button variant="primary"
        type="button"
        title="Apply to this position"
        onClick={this.handleClickApply.bind(this)}
      >
        Apply Now
      </Button>
      );
    } else if (!CurrentUser.isLoggedIn()) {
      applyButton = (
        <Button variant="primary"
        type="button"
        title="Apply to this position"
        href={url.section(Section.LogIn, url.getPreviousPageArg())}
      >
        Apply Now
      </Button>
      );
    }


    return (
      <div className="apply-position-button">
        {applyButton}
      </div>
    );
  }

  _renderHeader(): ?React$Node {
    const headerText: string = tagOptionDisplay(this.props.position.roleTag);
    return (
        <h3 className="form-group subheader">
          {headerText}
        </h3>
      )
  }
}

export default AboutPositionEntry;
