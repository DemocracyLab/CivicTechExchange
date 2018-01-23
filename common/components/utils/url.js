// @flow
import _ from 'lodash'

const regex = {
  protocol: new RegExp("^(f|ht)tps?://", "i"),
  argumentSplit: new RegExp("([^=]+)=(.*)")
}

class url {
  static section(section: string, args: ?Object) {
    var sectionUrl = "?section=" + section;
    if(args) {
      sectionUrl += _.reduce(args, function(argsString, value, key) {
          return `${argsString}&${key}=${value}`;
        }, ""
      );
    }
    return sectionUrl;
  }
  
  static arguments(url: string) {
    // Take argument section of url and split args into substrings
    var args = url.slice(url.indexOf("?") + 1).split("&");
    // Pull the key and value out of each arg substring into array pairs of [key,value]
    var argMatches = args.map(arg => regex.argumentSplit.exec(arg));
    var argPairs = argMatches.map(argMatch => [argMatch[1], argMatch[2]]);
    // Construct object from array pairs
    return _.fromPairs(argPairs);
  }
  
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
