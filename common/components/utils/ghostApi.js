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
  excerpt: string,
  feature_image: string,
|};

class ghostApiHelper {
  static browse(
    tag: string,
    successCallback: ($ReadOnlyArray<GhostPost>) => void,
    errCallback: string => void
  ) {
    ghostContentAPI.posts
      .browse({ filter: "tag:" + tag })
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
