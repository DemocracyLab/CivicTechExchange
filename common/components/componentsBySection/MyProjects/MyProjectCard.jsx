// @flow

import cx from '../../utils/cx';
import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';
import Section from '../../enums/Section.js'
import url from '../../utils/url.js'

type Props = {|
  +project: Project,
|};

class MyProjectCard extends React.PureComponent<Props> {

  render(): React$Node {
    const id = {'id':this.props.project.id};
    return (
      <a
        className="MyProjectCard-root"
        href={url.section(Section.AboutProject, id)}>
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
                  <a href={url.section(Section.EditProject, id)}>Edit</a>
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
