import React from "react";
import { isWithinIframe } from "../utils/iframe.js";

// This is a wrapper component that works with https://www.npmjs.com/package/iframe-resizer 
// to allow the components detect that they are within an iframe who's parent is running iframeresizer
// so they can change styles and act differently

export default class IframeResizerInParent extends React.Component {
    // iframe-resizer will create window.iFrameResizer
    // this code adds additional properties to that

    static inParent(){ // true if component is running in an iframe and the parent is running iframe-resizer
        return window.iFrameResizer?.inParent;
    }

    static onInParent(cb){    // when iframe-resizer is started by the parent, execute the call back so the component can rerender or something
        // iframe-resizer will create window.iFrameResize when it runs, but it may not exist yet
        if(!window.iFrameResizer) window.iFrameResizer={};
        if(!window.iFrameResizer.onInParent) window.iFrameResizer.onInParent=[];
        window.iFrameResizer.onInParent.push(cb);
    }

    static _detected(...args){
        // we are running in an iframe, and the parent has just started iframe-resizer
          if(!args[0].data.includes('[iFrameSizer]')) return;
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
          window.removeEventListener('message',IframeResizerInParent._detected);
    }
      
    componentDidMount(){
        // if page is not running within an iframe, this component is just a pass through
        if (window && document && isWithinIframe()) {
            // we are running within an iframe
            // allow parent frame to determine background color
            document.getElementsByTagName('body')[0].style.backgroundColor='transparent';
            // be prepared to detect IframeResizer has been run in parent window
            window.addEventListener('message', IframeResizerInParent._detected);
            // add the child side (in the iframe) javascript code to this page -- it's only relevant if running within an iframe
            const script = document.createElement('script');
            const body = document.getElementsByTagName('body')[0];
            script.src = '/static/iframeResizer.contentWindow.min.js';
            body.appendChild(script);
        }
    }
    render(): Array<React$Node> {
        return this.props.children;
    }
}