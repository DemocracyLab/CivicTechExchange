// @flow

class cdn {
  static image(fileName: string): string {
    return window.STATIC_CDN_URL + "/img/" + fileName;
  }
}

export default cdn;
