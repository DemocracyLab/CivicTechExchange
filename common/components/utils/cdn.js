// @flow

export const Images: { [key: string]: string } = {
  DL_GLYPH: "dl_identity_node_mark.png",
  PLATFORM_SPLASH: "platform_splash.png",
  EVENT_SPLASH: "event_splash.png",
  THANK_YOU: "CodeForGood_072719_MSReactor-020.jpg",
  DONATE_SPLASH: "SplashImage-7178-1400.jpg",
  PAYPAL_BUTTON: "PaypalDonateButton.png",
  CORE_VALUES_BG: "CoreValuesBG520.png",
  PROBLEM_SOLUTION_BG: "PuzzleBG.png",
};

class cdn {
  static image(fileName: string): string {
    return window.STATIC_CDN_URL + "/img/" + fileName;
  }

  static bgImage(fileName: string): string {
    const pathAndFile = cdn.image(fileName);
    return {
      backgroundImage: `url(${pathAndFile})`,
    };
  }

  static document(fileName: string): string {
    return window.STATIC_CDN_URL + "/documents/" + fileName;
  }
}

export default cdn;
