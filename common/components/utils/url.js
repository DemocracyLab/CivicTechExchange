// @flow

const regex = {
  protocol: new RegExp("^(f|ht)tps?://", "i")
}

class url {
  static appendHttpIfMissingProtocol(url: string): string {
    // TODO: Find a library that can handle this so we don't have to maintain regexes
    if (!regex.protocol.test(url)) {
      url = "http://" + url;
    }
    return url;
  }
  
  static beautify(url: string): string {
    // Remove http(s)
    return url.replace(regex.protocol, "");
  }
}

export default url
