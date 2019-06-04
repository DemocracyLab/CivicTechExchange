// @flow

import metrics from "./metrics.js";
import CurrentUser from "./CurrentUser.js";

export type NavigationLink = {|
  url: string,
  name: string,
  isButton: boolean
|};

const navLinks = [
  { url: "/index/?section=AboutUs", name: "About", isButton: false },
  { url: "/index/?section=Donate", name: "Donate", isButton: true },
  { url: "mailto:hello@democracylab.org", name :"Contact Us", isButton: false },
  { url: "/index/?section=Press", name: "News", isButton: false }
]

class NavigationLinks {
  static list() {
    return navLinks;
  }

  static logClick(link: NavigationLink): void {
    metrics.logClickHeaderLink(link.url, CurrentUser.userID());
  }
}

export default NavigationLinks;
