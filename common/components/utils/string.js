// @flow
import _ from "lodash";

// TODO: Update unit tests
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

  /**
   *
   * @param str                 string to trim
   * @param startSubstring      Substring to trim from start of string
   * @returns {string}          String with substring at beginning removed
   */
  static trimStartString(str: string, startSubstring: string): string {
    const startPattern: RegExp = new RegExp("^" + startSubstring);
    return str.replace(startPattern, "");
  }

  /**
   *
   * @returns {string} Random alphanumeric string
   */
  static randomAlphanumeric(): string {
    return Math.random().toString(36);
  }
}

export default stringHelper;
