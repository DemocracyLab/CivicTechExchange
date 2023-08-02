// @flow
import _ from "lodash";

const slugInvalidChars = new RegExp("[^A-Za-z0-9-]");

// TODO: Update unit tests
class stringHelper {
  /**
   * @returns {boolean}   true if string is null, empty string, or non-blank and consists of nothing but whitespace
   */
  static isEmptyOrWhitespace(str: string): void {
    return _.isEmpty(str) || _.trim(str) === "";
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
   * @param str         string to search in
   * @param startStrings  strings to search for
   * @returns {boolean} true if string started with any of the start strings
   */
  static startsWithAny(
    str: string,
    startStrings: $ReadOnlyArray<string>
  ): void {
    return (
      !_.isEmpty(startStrings) &&
      _.some(
        startStrings,
        (startString: string) => str && str.startsWith(startString)
      )
    );
  }

  /**
   *
   * @param str                 string to trim
   * @param startSubstring      Substring or list of substrings to trim from start of string
   * @returns {string}          String with substrings at beginning removed
   */
  static trimStartString(
    str: string,
    startSubstring: string | $ReadOnlyArray<string>
  ): string {
    const startSubstrings: $ReadOnlyArray<string> = _.isArray(startSubstring)
      ? startSubstring
      : [startSubstring];
    let _str: string = str;
    startSubstrings.forEach((subString: string) => {
      const startPattern: RegExp = new RegExp("^" + subString);
      _str = _str.replace(startPattern, "");
    });
    return _str;
  }

  /**
   *
   * @returns {string} Random alphanumeric string
   */
  static randomAlphanumeric(): string {
    return Math.random().toString(36);
  }

  /**
   *
   * @returns {boolean} Whether a string is a valid slug (i.e. doesn't have characters that are disallowed in slugs)
   */
  static isValidSlug(str: string): boolean {
    return !slugInvalidChars.test(str);
  }
}

export default stringHelper;
