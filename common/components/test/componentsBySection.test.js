import _ from "lodash";
import React from "react";
import renderer from "react-test-renderer";
import moment from "moment";
import window from "./__mocks__/window";
import mockAPI from "./__mocks__/mockAPI";
import { MyProjectData } from "../utils/CurrentUser.js";
import MyProjectCard, {
  getStatus,
} from "../componentsBySection/MyProjects/MyProjectCard";

const myprojectcardRenderedOutput = function(
  isOwner: boolean,
  project: MyProjectData
) {
  let status = getStatus(isOwner, project);
  let component = renderer.create(
    <MyProjectCard key={project.project_name} project={project} />
  );
  let tree = component.toTree();
  let buttons = tree.rendered.rendered[0].rendered[0].rendered[0].rendered[3].rendered.map(
    button => {
      return button.rendered[0];
    }
  );
  return [status, buttons];
};

describe("Components By Section", () => {
  test("My Project Card Project Owner role", () => {
    let project = mockAPI.my_projects.owned_projects[0];

    // Project Published
    expect(myprojectcardRenderedOutput(true, project)).toEqual([
      "Published",
      ["View", "Edit", "Delete"],
    ]);

    // Project Not Approved
    project.isApproved = false;
    expect(myprojectcardRenderedOutput(true, project)).toEqual([
      "Under Review",
      ["View", "Edit", "Delete"],
    ]);

    // Project Not Published
    project.isCreated = false;
    expect(myprojectcardRenderedOutput(true, project)).toEqual([
      "Unpublished",
      ["View", "Edit", "Delete"],
    ]);
  });
  test("My Project Card Volunteer role", () => {
    let project = mockAPI.my_projects.volunteering_projects[0];

    // Volunteer Approved
    expect(myprojectcardRenderedOutput(false, project)).toEqual([
      "Active",
      ["View"],
    ]);

    // Volunteer reaching expiration date
    project.isUpForRenewal = true;
    let status = "Expires on " + moment(project.projectedEndDate).format("l");
    expect(myprojectcardRenderedOutput(false, project)).toEqual([
      status,
      ["View", "Renew", "Conclude"],
    ]);
    project.isUpForRenewal = false;

    // Volunteer Not approved
    project.isApproved = false;
    expect(myprojectcardRenderedOutput(false, project)).toEqual([
      "Pending",
      ["View"],
    ]);
    project.isApproved = true;
  });
});
