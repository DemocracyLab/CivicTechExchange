import _ from "lodash";
import React from "react";
import renderer from "react-test-renderer";
import window from "./__mocks__/window";
import mockAPI from "./__mocks__/mockAPI";
import Avatar from "../common/avatar";
import type { UserAPIData } from "../utils/UserAPIUtils";

describe("common", () => {
  test("avatar can render thumbnail", () => {
    let user = mockAPI.user;
    const component = renderer.create(<Avatar user={user} />);
    let tree = component.toJSON();
    expect(tree.props.src).toEqual(user.user_thumbnail.publicUrl);
  });

  test("avatar renders icon by default", () => {
    let user = _.clone(mockAPI.user);
    user.user_thumbnail = null;
    const component = renderer.create(<Avatar user={user} />);
    let tree = component.toJSON();
    tree = JSON.stringify(tree);
    expect(tree).toMatch("PersonIcon");
  });
});
