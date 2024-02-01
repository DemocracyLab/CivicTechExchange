import React, {useEffect, useState} from "react";
import SectionController from "./SectionController.jsx";
import MainHeader from "../chrome/MainHeader.jsx";
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import SponsorFooter from "../chrome/SponsorFooter.jsx";
import SiteFooter from "../chrome/SiteFooter.jsx";
import url from "../../components/utils/url.js";
import IframeResizerInParent from "../common/IframeResizerInParent.jsx";
import urlHelper from "../../components/utils/url.js";
import Section from "../enums/Section.js";

export default function MainController() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    window.addEventListener("popstate", console.log); // handle back/foward navigation?
    IframeResizerInParent.onInParent(()=>{
      //if we are running within a resizable iframe, let the height go auto rather than being the height defined by the parent - since we will be resizing
      const style = document.createElement("style");
      style.textContent = ".Profile-primary-container.frame-full .AboutGroup-card-container .row .ProjectCardContainer .row {height: auto!important;}";
      document.head.appendChild(style);
    });
    
    // loadPage
    const currentUrl = url.cleanDemocracyLabUrl();
    const section = url.getSection(currentUrl);
    if (section) {
      UniversalDispatcher.dispatch({
        type: "SET_SECTION",
        section: section,
        url: window.location.href,
        fromUrl: true,
      });
    }
  });

  const ShowHeadAndFoot=!(urlHelper.atSection(Section.IframeProject)||urlHelper.atSection(Section.IframeGroup));
  return (
    <IframeResizerInParent>
      {ShowHeadAndFoot && <MainHeader
        key="main_header"
        onMainHeaderHeightChange={setHeaderHeight}
      />}
      <SectionController
        key="section_controller"
        headerHeight={headerHeight}
      />
      {ShowHeadAndFoot && <SponsorFooter key="sponsor_footer" />}
      {ShowHeadAndFoot && <SiteFooter key="site_footer" />}
    </IframeResizerInParent>
  );
}

// class MainController extends React.Component<{||}, State> {
//   constructor() {
//     super();
//     window.addEventListener("popstate", this.loadPage.bind(this));
//     this.state = {
//       headerHeight: 0,
//       currentSection: null,
//     };
//     IframeResizerInParent.onInParent(()=>{
//       //if we are running within a resizable iframe, let the height go auto rather than being the height defined by the parent - since we will be resizing
//       const style = document.createElement("style");
//       style.textContent = ".Profile-primary-container.frame-full .AboutGroup-card-container .row .ProjectCardContainer .row {height: auto!important;}";
//       document.head.appendChild(style);
//     });
//     this.loadPage();
//   }

//   loadPage() {
//     const currentUrl: string = url.cleanDemocracyLabUrl();
//     const section: string = url.getSection(currentUrl);
//     if (section) {
//       UniversalDispatcher.dispatch({
//         type: "SET_SECTION",
//         section: section,
//         url: window.location.href,
//         fromUrl: true,
//       });
//       this.setState({ currentSection: section });
//     }
//   }

//   _mainHeaderHeightChange(headerHeight) {
//     this.setState({
//       headerHeight: headerHeight,
//     });
//   }

//   render() {
//     const ShowHeadAndFoot=!(urlHelper.atSection(Section.IframeProject)||urlHelper.atSection(Section.IframeGroup));
//     return (
//       <IframeResizerInParent>
//         {ShowHeadAndFoot && <MainHeader
//           key="main_header"
//           onMainHeaderHeightChange={this._mainHeaderHeightChange.bind(this)}
//         />}
//         <SectionController
//           key="section_controller"
//           headerHeight={this.state.headerHeight}
//         />
//         {ShowHeadAndFoot && <SponsorFooter key="sponsor_footer" />}
//         {ShowHeadAndFoot && <SiteFooter key="site_footer" />}
//       </IframeResizerInParent>
//     )
//   }
// }

// export default MainController;
