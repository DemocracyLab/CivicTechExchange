// @flow
import _ from "lodash";

class stringHelper {
  /**
   * @returns {boolean}   true if string is non-blank and consists of nothing but whitespace
   */
  static isWhitespace(str: string): void {
    return str.length > 0 && _.trim(str) === "";
  }

  /**
   * @param str         string to search in
   * @param substrings  substrings to search for
   * @returns {boolean} true if any substring was found withing string
   */
  static contains(str: string, substrings: $ReadOnlyArray<string>): void {
    return _.some(substrings, (substring: string) => str.includes(substring));
  }
}

export default stringHelper;
