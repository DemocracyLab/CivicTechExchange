// @flow

import type { TagDefinition } from "./ProjectAPIUtils.js";
import type { LinkInfo } from "../forms/LinkInfo.jsx";
import type { FileInfo } from "../common/FileInfo.jsx";
import { APIError, APIResponse } from "./api.js";

export type UserAPIData = {|
  +id: number,
  +email: string,
  +first_name: string,
  +last_name: string,
  +about_me: string,
  +postal_code: string,
  +country: string,
  +user_thumbnail: FileInfo,
  +user_technologies: $ReadOnlyArray<TagDefinition>,
  +user_links: $ReadOnlyArray<LinkInfo>,
  +user_files: $ReadOnlyArray<FileInfo>,
|};

class UserAPIUtils {
  static fetchUserDetails(
    id: number,
    callback: UserAPIData => void,
    errCallback: APIError => void
  ): void {
    fetch(new Request("/api/user/" + id + "/"))
      .then(response => {
        if (!response.ok) {
          throw Error();
        }
        return response.json();
      })
      .then(projectDetails => callback(projectDetails))
      .catch(
        response =>
          errCallback &&
          errCallback({
            errorCode: response.status,
            errorMessage: JSON.stringify(response),
          })
      );
  }

  // TODO: Refactor generic code into separate file
  static post(
    url: string,
    body: {||},
    successCallback: APIResponse => void,
    errCallback: APIError => void
  ) {
    const doError = response =>
      errCallback &&
      errCallback({
        errorCode: response.status,
        errorMessage: JSON.stringify(response),
      });

    fetch(
      new Request(url, {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
    )
      .then(response =>
        UserAPIUtils.isSuccessResponse(response)
          ? successCallback()
          : doError(response)
      )
      .catch(response => doError(response));
  }

  static isSuccessResponse(response: APIResponse): boolean {
    return response.status < 400;
  }
}

export default UserAPIUtils;
