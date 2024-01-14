// @flow

import React from "react";
import CurrentUser, { UserContext, MyGroupData } from "../utils/CurrentUser.js";
import ProjectAPIUtils from "../utils/ProjectAPIUtils.js";
import MyGroupsCard from "../componentsBySection/MyGroups/MyGroupsCard.jsx";
import url from "../utils/url.js";
import ConfirmationModal from "../common/confirmation/ConfirmationModal.jsx";
import metrics from "../utils/metrics.js";
import LogInController from "./LogInController.jsx";
import Section from "../enums/Section.js";
import _ from "lodash";

type State = {|
  showConfirmDeleteModal: boolean,
  group_id:string,
|};

class GroupProjectsController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    // const userContext: UserContext = CurrentUser.userContext();
    this.state = {
      // ownedGroups: userContext.owned_groups,
      group_id:"",
      showConfirmDeleteModal: false,
    };
  }
  componentDidMount(){
    const groupId: string = url.argument("group_id");
    this.setState(()=>{return {group_id:groupId}})

  }
  render(): React$Node {
    return (<React.Fragment><div className="GroupProjectsController-root">This group show project page. Group ID is: {this.state.group_id}</div></React.Fragment>);
  }

}

export default GroupProjectsController;
