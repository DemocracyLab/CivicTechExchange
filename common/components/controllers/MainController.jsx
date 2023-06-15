// @flow

import SectionController from "./SectionController.jsx";
import MainHeader from "../chrome/MainHeader.jsx";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import React from "react";
import SponsorFooter from "../chrome/SponsorFooter.jsx";
import SiteFooter from "../chrome/SiteFooter.jsx";
import url from "../../components/utils/url.js";
import { loadHeap } from "../utils/heapApi.js";

type State = {|
  headerHeight: number,
  currentSection: ?string,
|};

class MainController extends React.Component<{||}, State> {
  constructor() {
    super();
    window.addEventListener("popstate", this.loadPage.bind(this));
    this.state = {
      headerHeight: 0,
      currentSection: null,
    };
  }

  componentDidMount(): void {
    this.loadPage();
  }

  loadPage(): void {
    const currentUrl: string = url.cleanDemocracyLabUrl();
    const section: string = url.getSection(currentUrl);
    if (section) {
      UniversalDispatcher.dispatch({
        type: "SET_SECTION",
        section: section,
        url: window.location.href,
        fromUrl: true,
      });
      this.setState({ currentSection: section });
    }
  }

  _mainHeaderHeightChange(headerHeight) {
    this.setState({
      headerHeight: headerHeight,
    });
  }

  render(): Array<React$Node> {
    return [
      <MainHeader
        key="main_header"
        onMainHeaderHeightChange={this._mainHeaderHeightChange.bind(this)}
      />,
      <SectionController
        key="section_controller"
        headerHeight={this.state.headerHeight}
      />,
      <SponsorFooter key="sponsor_footer" />,
      <SiteFooter key="site_footer" />,
    ];
  }
}

export default MainController;
