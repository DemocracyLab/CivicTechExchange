// @flow

import type {VolunteerUserData} from "../../utils/ProjectAPIUtils.js";

export type BioPersonData = {|
  first_name: string,
  last_name: string,
  title: string,
  user_thumbnail: ?string,
  bio_text: ?string
|};

export function VolunteerUserDataToBioPersonData(v: VolunteerUserData, title: string): BioPersonData {
    return {
      first_name: v.first_name,
      last_name: v.last_name,
      title: title,
      user_thumbnail: v.user_thumbnail.publicUrl,
      bio_text: v.about_me
    };
}