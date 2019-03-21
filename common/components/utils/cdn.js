// @flow

export const Images: { [key: string]: string } = {
  DL_GLYPH: "dl_identity_node_mark.png"
};

class cdn {
  static image(fileName: string): string {
    return window.STATIC_CDN_URL + "/img/" + fileName;
  }
}

export default cdn;
