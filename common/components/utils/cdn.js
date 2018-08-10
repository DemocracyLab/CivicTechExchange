// @flow
const cdnUrl: string = "https://dprhz3gr7kco1.cloudfront.net";

class cdn {
  static image(fileName: string): string {
    return cdnUrl + "/img/" + fileName;
  }
}

export default cdn
