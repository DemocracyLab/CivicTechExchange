// @flow

import React from "react";
import ProjectOwnerCard from "./ProjectOwnerCard.jsx";
import { VolunteerUserData } from "../../utils/ProjectAPIUtils.js";
import _ from "lodash";

type Props = {|
  +owners: $ReadOnlyArray<VolunteerUserData>,
|};

type State = {|
  +owners: ?Array<VolunteerUserData>,
|};

class ProjectOwnersSection extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      owners: _.cloneDeep(props.owners),
    };
  }

  render(): React$Node {
    return <div>{this._renderProjectOwners()}</div>;
  }

  _renderProjectOwners(): ?React$Node {
    return !_.isEmpty(this.state.owners)
      ? this._renderOwnersSection(this.state.owners, "PROJECT OWNER")
      : null;
  }

  _renderOwnersSection(
    owners: ?Array<VolunteerUserData>,
    header: string
  ): React$Node {
    return !_.isEmpty(owners) ? (
      <div className="Text-section ProjectOwners-projectOwnersList">
        {owners.map((owner, i) => (
          <ProjectOwnerCard key={i} owner={owner} />
        ))}
      </div>
    ) : null;
  }
}

export default ProjectOwnersSection;
