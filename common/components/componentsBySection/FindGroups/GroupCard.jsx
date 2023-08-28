// @flow

import React from "react";
import Section from "../../../components/enums/Section.js";
import url from "../../utils/url.js";
import Moment from "react-moment";
import type { Dictionary } from "../../types/Generics.jsx";
import Sort from "../../utils/sort.js";
import Truncate from "../../utils/truncate.js";
import GlyphStyles from "../../utils/glyphs.js";
import utils from "../../utils/utils.js";
import GroupAPIUtils, { GroupTileAPIData } from "../../utils/GroupAPIUtils.js";
import type { TagDefinition } from "../../utils/ProjectAPIUtils.js";

type Props = {|
  group: GroupTileAPIData,
  tagDictionary: Dictionary<TagDefinition>,
  maxTextLength: number,
  maxIssuesCount: number,
|};
//fontawesome fixed width class
const glyphFixedWidth = " fa-fw";

class GroupCard extends React.PureComponent<Props> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="ProjectCard-root">
        <a
          href={url.section(Section.AboutGroup, {
            id: this.props.group.group_slug || this.props.group.group_id,
          })}
          rel="noopener noreferrer"
        >
          {this._renderLogo()}
          {this._renderSubInfo()}
          {this._renderTitleAndIssue()}
          {this._renderGroupDescription()}
          {this._renderIssueAreas()}
        </a>
      </div>
    );
  }
  _renderLogo(): React$Node {
    return (
      <div className="ProjectCard-logo">
        <img
          src={
            this.props.group && this.props.group.group_thumbnail
              ? this.props.group.group_thumbnail.publicUrl
              : "/static/images/projectlogo-default.png"
          }
          alt="Project Logo"
        />
      </div>
    );
  }
  _renderTitleAndIssue(): React$Node {
    const group: GroupTileAPIData = this.props.group;
    return (
      <div className="ProjectCard-title">
        <h2>{group.group_name}</h2>
        <h4>
          {group.group_project_count +
            " " +
            utils.pluralize("project", "projects", group.group_project_count)}
        </h4>
      </div>
    );
  }
  _renderGroupDescription(): React$Node {
    return (
      <div className="ProjectCard-description">
        <p>
          {Truncate.stringT(
            this.props.group.group_short_description,
            this.props.maxTextLength
          )}
        </p>
      </div>
    );
  }
  _renderIssueAreas(): React$Node {
    return (
      <div className="ProjectCard-skills">{this._generateIssueList()}</div>
    );
  }
  _generateIssueList(): React$Node {
    // Get sorted truncated list of tag names
    let issueNames: $ReadOnlyArray<string> = Sort.byCountDictionary(
      this.props.group.group_issue_areas
    );

    if (!_.isEmpty(issueNames)) {
      issueNames = issueNames.map(
        (issueName: string) => this.props.tagDictionary[issueName].display_name
      );
      issueNames = Truncate.arrayT(issueNames, this.props.maxIssuesCount);

      return (
        <React.Fragment>
          <h3>Issues</h3>
          <ul>
            {issueNames.map((issueName: string, i: number) => (
              <li key={i}>{issueName}</li>
            ))}
          </ul>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
  _renderSubInfo(): React$Node {
    const group: GroupTileAPIData = this.props.group;
    const location: string =
      group.group_country &&
      GroupAPIUtils.getLocationDisplayName(group.group_country);
    return (
      <div className="ProjectCard-subinfo">
        <ul>
          {location && (
            <li>
              <i className={GlyphStyles.MapMarker + glyphFixedWidth}></i>
              {location}
            </li>
          )}
          {group.group_date_modified && (
            <li>
              <i className={GlyphStyles.Clock + glyphFixedWidth}></i>
              <Moment fromNow>{group.group_date_modified}</Moment>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default GroupCard;
