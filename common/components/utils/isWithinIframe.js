// true if component is rendering within an iframe of another web page
export default function isWithinIframe(){
    return window?.parent !== window
}