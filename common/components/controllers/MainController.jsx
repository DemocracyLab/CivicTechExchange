// @flow

import SectionController from "./SectionController.jsx";
import MainHeader from "../chrome/MainHeader.jsx";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import React from "react";
import SponsorFooter from "../chrome/SponsorFooter.jsx";
import SiteFooter from "../chrome/SiteFooter.jsx";
import url from "../../components/utils/url.js";
import { loadHeap } from "../utils/heapApi.js";
import isWithinIframe from "../utils/isWithinIframe.js";

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

  static iframeresizerInParent(...args){
    // if we are running within an iframe, and the parent is running IframeResizer then do this
      if(!args[0].data.includes('[iFrameSizer]')) return;
      // let the height go auto rather than being the height defined by the parent - since we will be resizing
      const style = document.createElement("style");
      style.textContent = ".Profile-primary-container.frame-full .AboutGroup-card-container .row .ProjectCardContainer .row {height: auto!important;}";
      document.head.appendChild(style);
      if(!window.iFrameResizer) window.iFrameResizer={};
      window.iFrameResizer.inParent=true;
      /*There could be multiple components needing to be re-rendered after iframe resizer starts, each will add a callback
      * to the array: onInParent.
      * Components may need to rerender after iframeresizer starts because their style needs to change if rendering 
      * in an iframe that resizes v. rendering in an iframe that doesn't resize.
      */
      let func;
      while((func=window.iFrameResizer.onInParent?.shift()))
        func();
      window.removeEventListener('message',MainController.iframeresizerInParent);
  }
  
  componentDidMount(){
    if (window && document && isWithinIframe()) {
      // we are running within an iframe
      // allow parent frame to determine background color
      document.getElementsByTagName('body')[0].style.backgroundColor='transparent'
      // check for IframeResizer in parent window
      window.addEventListener('message', MainController.iframeresizerInParent)
      const script = document.createElement('script')
      const body = document.getElementsByTagName('body')[0]
      script.src = '/static/iframeResizer.contentWindow.min.js'
      body.appendChild(script)
    }
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
    const ShowHeadAndFoot=!(window.location.pathname.includes('/groups/inframe')||window.location.pathname.includes('/projects/inframe'))
    return <>
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
    </>
  }
}

export default MainController;
