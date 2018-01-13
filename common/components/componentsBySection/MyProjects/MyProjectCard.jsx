// @flow

import cx from '../../utils/cx';
import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';

type Props = {|
  +project: Project,
|};

class MyProjectCard extends React.PureComponent<Props> {

  render(): React$Node {
    return (
      <a
        className="MyProjectCard-root"
        href={'?section=AboutProject&id=' + this.props.project.id}>
         <table className="MyProjectCard-table">
          <tbody>
            <tr>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Project Name
                </tr>
                <tr className="MyProjectCard-projectName">
                  {this.props.project.name}
                </tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Your Role
                </tr>
                <tr>Project Lead</tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  Project Status
                </tr>
                <tr>In Progress</tr>
              </td>
              <td className="MyProjectCard-column">
                <tr className="MyProjectCard-header">
                  <a href={'?section=EditProject&id=' + this.props.project.id}>Edit</a>
                </tr>
              </td>
            </tr>
          </tbody>
        </table>
      </a>
    );
  }
}

export default MyProjectCard;
