// @flow

export const Images: { [key: string]: string } = {
  DL_GLYPH: "dl_identity_node_mark.png",
  PLATFORM_SPLASH: "platform_splash.png",
  EVENT_SPLASH: "event_splash.png",
  THANK_YOU: "ThankYouBG_slim.jpg",
  DONATE_SPLASH: "DonateBG.jpg",
  PAYPAL_BUTTON: "PaypalDonateButton.png"
};

class cdn {
  static image(fileName: string): string {
    return window.STATIC_CDN_URL + "/img/" + fileName;
  }

  static bgImage(fileName: string): string {
    const pathAndFile = cdn.image(fileName);
    return ({
      backgroundImage: `url(${pathAndFile})`
    })
  }
}

export default cdn;
