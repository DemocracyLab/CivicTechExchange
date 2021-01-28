// @flow

import React from "react";
import Headers from "../common/Headers.jsx";
import { APIError } from "../utils/api.js";
import url from "../utils/url.js";
import prerender from "../utils/prerender.js";
import GroupAPIUtils, { GroupDetailsAPIData } from "../utils/GroupAPIUtils.js";
import AboutGroupDisplay from "../common/groups/AboutGroupDisplay.jsx";

type State = {|
  group: ?GroupDetailsAPIData,
  loadStatusMsg: string,
  statusCode: string,
|};

class AboutGroupController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = {
      project: null,
      loadStatusMsg: "Loading...",
    };
  }

  componentDidMount() {
    const groupId: string = url.argument("id");
    GroupAPIUtils.fetchGroupDetails(
      groupId,
      this.loadGroupDetails.bind(this),
      this.handleLoadGroupFailure.bind(this)
    );
  }

  loadGroupDetails(group: GroupDetailsAPIData) {
    this.setState(
      {
        group: group,
      },
      prerender.ready
    );
  }

  handleLoadGroupFailure(error: APIError) {
    this.setState({
      loadStatusMsg: "Could not load Group",
      statusCode: "404",
    });
  }

  render(): $React$Node {
    return this.state.group ? this._renderDetails() : this._renderLoadMessage();
  }

  _renderDetails(): React$Node {
    return (
      <React.Fragment>
        {this._renderGroupHeader(this.state.group)}
        <AboutGroupDisplay group={this.state.group} viewOnly={false} />
      </React.Fragment>
    );
  }

  _renderGroupHeader(group: GroupDetailsAPIData): React$Node {
    const title: string = group.group_name + " | DemocracyLab";
    const description: string = group.group_short_description;

    return (
      <Headers
        title={title}
        description={description}
        thumbnailUrl={group.group_thumbnail && group.group_thumbnail.publicUrl}
      />
    );
  }

  _renderLoadMessage(): React$Node {
    return (
      <React.Fragment>
        <div>{this.state.loadStatusMsg}</div>
      </React.Fragment>
    );
  }
}

export default AboutGroupController;
