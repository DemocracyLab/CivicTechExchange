// @flow

import cx from '../../utils/cx';
import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';
import Section from '../../enums/Section.js';
import url from '../../utils/url.js';
import Button from 'react-bootstrap';

type Props = {|
  +project: Project,
|};

const style = {
  textDecoration: 'none'
}

class MyProjectCard extends React.PureComponent<Props> {

  render(): React$Node {
    const id = {'id':this.props.project.id};
    return (
      <div className="MyProjectCard-root">
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
                  // make View a button
                  <a style={style} href={url.section(Section.AboutProject, id)}>View</a>
                  // make Edit a button
                  <a style={style} href={url.section(Section.EditProject, id)}>Edit</a>
                  // the Delete button will need to:
                  // - pass the id to MyProjectController

                  // MyProjectController will need to:
                  // - bring up the confirmation modal
                  // - if 'yes', use url.js to create the delete route and delete
                  // - then remove the project from this.state.projects, rerender list of project cards
                </tr>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default MyProjectCard;
