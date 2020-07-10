// @flow


import React from 'react';
import type {ReduceStore} from 'flux/utils';
import GroupSearchSort from "./GroupSearchSort.jsx";
import GroupTagContainer from "./GroupTagContainer.jsx";
import {Container} from 'flux/utils';
import {List} from 'immutable'
import GroupCard from "./GroupCard.jsx";
import GroupSearchStore from "../../stores/GroupSearchStore.js";
import GroupSearchDispatcher from "../../stores/GroupSearchDispatcher.js";
import LoadingMessage from '../../chrome/LoadingMessage.jsx';
import prerender from "../../utils/prerender.js";
import type {LocationRadius} from "../../stores/ProjectSearchStore.js";
import {Dictionary, createDictionary} from "../../types/Generics.jsx";
import type {TagDefinition} from "../../utils/ProjectAPIUtils.js";
import type {GroupTileAPIData} from "../../utils/GroupAPIUtils.js";
import utils from "../../utils/utils.js";
import _ from 'lodash';


type Props = {|
  showSearchControls: ?boolean,
  staticHeaderText: ?string,
  fullWidth: ?boolean,
|}

type State = {|
  groups: List<GroupTileAPIData>,
  group_pages: number,
  current_page: number,
  group_count: number,
  location: LocationRadius,
  tagDictionary: Dictionary<TagDefinition>
|};

class GroupCardsContainer extends React.Component<Props, State> {

  static getStores(): $ReadOnlyArray<ReduceStore> {
    return [GroupSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      groups: GroupSearchStore.getGroups(),
      group_pages: GroupSearchStore.getGroupPages(),
      group_count: GroupSearchStore.getNumberOfGroups(),
      current_page: GroupSearchStore.getCurrentPage(),
      groups_loading: GroupSearchStore.getGroupsLoading(),
      keyword: GroupSearchStore.getKeyword() || '',
      tags: GroupSearchStore.getSelectedTags() || [],
      location: GroupSearchStore.getLocation() || '',
      tagDictionary: GroupSearchStore.getAllTags() || []
    };
  }

  render(): React$Node {
    return (
      <div className={`ProjectCardContainer col-12 ${this.props.fullWidth ? '' : 'col-md-8 col-lg-9 p-0 m-0'}`}>
        <div className="container-fluid">
          {
            this.props.showSearchControls
            ? (
              <React.Fragment>
                <GroupSearchSort/>
                <GroupTagContainer/>
              </React.Fragment>
              )
            : null
          }
          <div className="row">
            {!_.isEmpty(this.state.groups) && <h2 className="ProjectCardContainer-header">{this._renderCardHeaderText()}</h2>}
            {this._renderCards()}
          </div>
          <div>
            {this._renderPagination()}
          </div>
        </div>
      </div>
    );
  }

  _renderCardHeaderText(): React$Node {
    if (this.props.staticHeaderText) {
      return this.props.staticHeaderText;
    } else if (this.state.keyword || this.state.tags.size > 0 || (this.state.location && this.state.location.latitude && this.state.location.longitude)) {
      return this.state.group_count + " " + utils.pluralize("group", "groups", this.state.group_count) + " found";
    } else {
      return 'Find groups that match your interests'
    }
  }

  _renderCards(): React$Node {
    return !this.state.groups
      ? <LoadingMessage message="Loading groups..." />
      : this.state.groups.size === 0
        ? 'No Groups match the provided criteria. Try a different set of filters or search term.'
        : this.state.groups.map(
          (group: GroupTileAPIData, index: number) =>
            <div className="col-sm-12 col-lg-6">
              <GroupCard
                group={group}
                key={index}
                maxTextLength={140}
                maxIssuesCount={4}
                tagDictionary={this.state.tagDictionary}
              />
            </div>
      );
    }

  _handleFetchNextPage(e: object): void {
    e.preventDefault();

    const nextPage = this.state.current_page + 1 <= this.state.group_pages
      ? this.state.current_page + 1
      : this.state.current_page;

    this.setState({current_page: nextPage }, function () {
      GroupSearchDispatcher.dispatch({
        type: 'SET_PAGE',
        page: this.state.current_page,
      });
    });
  }

  _renderPagination(): ?React$Node {
    if ((this.state.current_page === this.state.group_pages) && !this.state.groups_loading ) {
      return null;
    }
    if (!_.isEmpty(this.state.groups) && this.state.groups_loading) {
      return (
        <div className="page_selection_footer">
          <button className="btn btn-primary disabled">
            Loading...
          </button>
        </div>
      )
    }
    return (
      this.state.groups && this.state.groups.size !== 0
      ? <div className="page_selection_footer">
        <button className="btn btn-primary" onClick={this._handleFetchNextPage.bind(this)}>
          More Groups...
        </button>
      </div>
      : null
    );
  }
}



export default Container.create(GroupCardsContainer);
