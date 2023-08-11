// @flow

import SectionController from "./SectionController.jsx";
import MainHeader from "../chrome/MainHeader.jsx";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import React from "react";
import SponsorFooter from "../chrome/SponsorFooter.jsx";
import SiteFooter from "../chrome/SiteFooter.jsx";
import url from "../../components/utils/url.js";
import { loadHeap } from "../utils/heapApi.js";
import IframeResizerInParent from "../common/IframeResizerInParent.jsx";

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
    IframeResizerInParent.onInParent(()=>{
      //if we are running within a resizable iframe, let the height go auto rather than being the height defined by the parent - since we will be resizing
      const style = document.createElement("style");
      style.textContent = ".Profile-primary-container.frame-full .AboutGroup-card-container .row .ProjectCardContainer .row {height: auto!important;}";
      document.head.appendChild(style);
    })
  }

  componentWillMount(): void {
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
    const ShowHeadAndFoot=!(window.location.pathname.includes('/groups/inframe')||window.location.pathname.includes('/projects/inframe'));
    return (
      <IframeResizerInParent>
        {ShowHeadAndFoot && <MainHeader
          key="main_header"
          onMainHeaderHeightChange={this._mainHeaderHeightChange.bind(this)}
        />}
        <SectionController
          key="section_controller"
          headerHeight={this.state.headerHeight}
        />
        {ShowHeadAndFoot && <SponsorFooter key="sponsor_footer" />}
        {ShowHeadAndFoot && <SiteFooter key="site_footer" />}
      </IframeResizerInParent>
    )
  }
}

export default MainController;
