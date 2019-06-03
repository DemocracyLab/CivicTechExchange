// @flow

import metrics from "./metrics.js";
import CurrentUser from "./CurrentUser.js";

type DLAB_NAV_LINK = {|
  u: string,
  n: string,
  isButton: ?boolean
|};

export type NavigationLink = {|
  url: string,
  name: string,
  isButton: boolean
|};

const siteNavLinks =
[
  {"u":"/index/?section=AboutUs","n":"About"},
  {"u":"/index/?section=Donate","n":"Donate", "isButton":"true"},
  {"u":"mailto:hello@democracylab.org","n":"Contact Us"},
  {"u":"/index/?section=Press","n":"News"}
]


class NavigationLinks {
  static list(): $ReadOnlyArray<NavigationLink> {
    try {
      const envLinks: $ReadOnlyArray<DLAB_NAV_LINK> = siteNavLinks;
      return envLinks.map( (link:DLAB_FOOTER_LINK) => ({url:link.u, name:link.n, isButton:link.isButton}));
    } catch(ex) {
      console.error("Failed to parse navigation links. ", ex);
      return [];
    }
  }

  static logClick(link: NavigationLink): void {
    metrics.logClickHeaderLink(link.url, CurrentUser.userID());
  }
}

export default NavigationLinks;
