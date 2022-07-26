// @flow
import GhostContentAPI from "@tryghost/content-api";

const ghostContentAPI =
  window.GHOST_URL &&
  window.GHOST_CONTENT_API_KEY &&
  new GhostContentAPI({
    url: window.GHOST_URL,
    key: window.GHOST_CONTENT_API_KEY,
    version: "v3",
  });

export type GhostPost = {|
  title: string,
  url: string,
  slug: string,
  excerpt: ?string,
  custom_excerpt: ?string,
  feature_image: string,
|};

class ghostApiHelper {
  static browse(
    tag: string,
    successCallback: ($ReadOnlyArray<GhostPost>) => void,
    errCallback: string => void
  ) {
    ghostContentAPI.posts
      .browse({
        filter: "tag:" + tag,
        fields: "title, url, slug, excerpt, custom_excerpt, feature_image",
      })
      .then(postsResponse => {
        successCallback
          ? successCallback(postsResponse)
          : console.log(JSON.stringify(postsResponse));
      })
      .catch(err => {
        errCallback ? errCallback(err) : console.error(err);
      });
  }
  static isConfigured(): boolean {
    return !!ghostContentAPI;
  }
}
// get the two most recent posts, return more fields than the carousel uses
// this is for the homepage's blog section, which is meant to be a static display
export class ghostApiRecent {
  static browse(
    successCallback: ($ReadOnlyArray<GhostPost>) => void,
    errCallback: string => void
  ) {
    ghostContentAPI.posts
      .browse({
        limit: 2,
        include: "tags,authors",
        //per the API docs, fields does not play well with include, so we'll grab everything from the api, even though we don't need it all.
        // fields: "title, url, slug, excerpt, custom_excerpt, feature_image, reading_time, primary_author, primary_tag, published_at, updated_at"
      })
      .then(postsResponse => {
        successCallback
          ? successCallback(postsResponse)
          : console.log(JSON.stringify(postsResponse));
      })
      .catch(err => {
        errCallback ? errCallback(err) : console.error(err);
      });
  }
  static isConfigured(): boolean {
    return !!ghostContentAPI;
  }
}

export default ghostApiHelper;
