// @flow

import type {
  VolunteerUserData,
  VolunteerDetailsAPIData,
} from "../../utils/ProjectAPIUtils.js";
import type { Dictionary } from "../../types/Generics.jsx";

export type BioPersonData = {|
  first_name: string,
  last_name: string,
  title: ?$ReadOnlyArray<string>,
  title_tag: ?string,
  user_thumbnail: ?string,
  bio_text: ?string,
  profile_id: ?number,
  isTeamLeader: boolean,
|};

export function VolunteerUserDataToBioPersonData(
  v: VolunteerUserData,
  title: string,
  title_tag: ?string,
  nameOverrides: ?Dictionary<string>,
  isTeamLeader: boolean
): BioPersonData {
  const _title: string =
    nameOverrides && title_tag in nameOverrides
      ? nameOverrides[title_tag]
      : title;
  return {
    first_name: v.first_name,
    last_name: v.last_name,
    title: [_title],
    title_tag: title_tag,
    user_thumbnail: v.user_thumbnail && v.user_thumbnail.publicUrl,
    bio_text: v.about_me,
    profile_id: v.id,
    isTeamLeader: isTeamLeader,
  };
}

export function VolunteerDetailsAPIDataEqualsBioPersonData(
  v: VolunteerDetailsAPIData,
  b: BioPersonData
): boolean {
  return VolunteerUserDataEqualsBioPersonData(v.user, b);
}

export function VolunteerUserDataEqualsBioPersonData(
  v: VolunteerUserData,
  b: BioPersonData
): boolean {
  return v.first_name === b.first_name && v.last_name === b.last_name;
}
