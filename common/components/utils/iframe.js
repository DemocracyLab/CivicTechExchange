// the idea of iframe.js is it's a bunch of utility functions for iframes

// true if component is rendering within an iframe of another web page
export function isWithinIframe(){
    return window?.parent !== window
}
