// @flow
import React from "react";
import Button from "react-bootstrap/Button";
import { PositionInfo } from "../../forms/PositionInfo.jsx";
import { ProjectDetailsAPIData } from "../../utils/ProjectAPIUtils.js";
import CollapsibleTextSection from "../CollapsibleTextSection.jsx";
import { tagOptionDisplay } from "../tags/TagSelector.jsx";
import GlyphStyles from "../../utils/glyphs.js";
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import CurrentUser from "../../utils/CurrentUser";

type Props = {|
  +project: ProjectDetailsAPIData,
  +position: PositionInfo,
  +onClickApply: PositionInfo => void,
  +hideSignInToApply: ?boolean,
|};

class AboutPositionEntry extends React.PureComponent<Props> {
  handleClickApply(): void {
    this.props.onClickApply(this.props.position);
  }

  render(): React$Node {
    const showApplyButton: boolean =
      this.props.onClickApply &&
      !CurrentUser.isOwnerOrVolunteering(this.props.project);

    return (
      <div className="Position-entry">
        {this._renderHeader()}
        {this.props.position.descriptionUrl && (
          <div className="Position-description-link">
            <a
              href={this.props.position.descriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={GlyphStyles.Globe}></i> Position description
            </a>
          </div>
        )}
        <div className="Text-section" style={{ whiteSpace: "pre-wrap" }}>
          <CollapsibleTextSection
            text={this.props.position.description}
            expanded={false}
            maxCharacters={200}
            maxLines={3}
          />
        </div>
        {this._renderApplyButton(showApplyButton)}
      </div>
    );
  }

  _renderApplyButton(showApplyButton: boolean): ?React$Node {
    let applyButton;
    if (showApplyButton && CurrentUser.canVolunteerFor(this.props.project)) {
      applyButton = (
        <Button
          variant="primary"
          type="button"
          title="Apply to this position"
          onClick={this.handleClickApply.bind(this)}
        >
          Apply Now
        </Button>
      );
    } else if (!this.props.hideSignInToApply && !CurrentUser.isLoggedIn()) {
      applyButton = (
        <Button
          variant="primary"
          className="AboutProject-button"
          type="button"
          disabled={false}
          title="Sign in to Apply"
          href={url.logInThenReturn()}
        >
          Apply
        </Button>
      );
    }

    return <div className="apply-position-button">{applyButton}</div>;
  }

  _renderHeader(): ?React$Node {
    const headerText: string = tagOptionDisplay(this.props.position.roleTag);
    return <h3 className="form-group">{headerText}</h3>;
  }
}

export default AboutPositionEntry;
