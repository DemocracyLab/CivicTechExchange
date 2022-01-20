// @flow

//for navigation links we want to be buttons or not Sections in our schema
import metrics from "./metrics.js";
import CurrentUser from "./CurrentUser.js";
import url from "./url.js";
import Section from "../enums/Section.js";

export type NavigationLink = {|
  url: string,
  name: string,
  isButton: boolean,
|};

const navLinks = [
  { url: url.section(Section.Donate), name: "Donate", isButton: true },
];

class NavigationLinks {
  static list() {
    return navLinks;
  }

  static logClick(link: NavigationLink): void {
    metrics.logClickHeaderLink(link.url, CurrentUser.userID());
  }
}

export default NavigationLinks;
