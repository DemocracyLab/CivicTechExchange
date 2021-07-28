// @flow

import type { Dictionary, KeyValuePair } from "../types/Generics.jsx";
import _ from "lodash";

class htmlDocument {
  // Get dictionary of cookies on the page
  static cookies(): Dictionary<string> {
    const cookieParts: $ReadOnlyArray<string> = document.cookie.split(";");
    const cookiePairs: KeyValuePair<string> = cookieParts.map(
      (cookiePart: string) => cookiePart.trim().split("=")
    );
    return _.fromPairs(cookiePairs);
  }
}

export default htmlDocument;
