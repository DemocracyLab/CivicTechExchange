// @flow

import cx from '../../utils/cx';
import type {Project} from '../../stores/ProjectSearchStore.js';
import React from 'react';
import Section from '../../enums/Section.js';
import url from '../../utils/url.js';
import {Button} from 'react-bootstrap';

type Props = {|
  +project: Project,
  +onProjectClickDelete: (Project) => void,
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
                  <Button className="MyProjectCard-button" href={url.section(Section.AboutProject, id)} bsStyle="info">View</Button>
                  <Button className="MyProjectCard-button" href={url.section(Section.EditProject, id)} bsStyle="info">Edit</Button>
                  <Button className="MyProjectCard-button" bsStyle="danger" onClick={() => this.props.onProjectClickDelete(this.props.project)}>Delete</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default MyProjectCard;
