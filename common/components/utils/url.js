// @flow
import UniversalDispatcher from "../stores/UniversalDispatcher.js";
import CurrentUser from "./CurrentUser.js";
import Section from "../enums/Section.js";
import { Dictionary } from "../types/Generics.jsx";
import _ from "lodash";
import isURL from "validator/lib/isURL";
import urls_v2 from "../urls/urls_v2.json";

const regex = {
  protocol: new RegExp("^(f|ht)tps?://", "i"),
  argumentSplit: new RegExp("([^=]+)=(.*)"),
  regexControlChars: new RegExp("[\\^\\$]", "g"),
};

// TODO: need pattern for anything?
type TemplateFunc = Object => string;
// TODO: Rename name to section
type UrlPattern = {|
  name: string,
  pattern: string,
  templateFunc: TemplateFunc,
  regex: RegExp,
|};

type ProcessedUrlPattern = {|
  url: string,
  args: Dictionary<string>,
|} & UrlPattern;

function importUrls(urls_vx): Dictionary<UrlPattern> {
  const sanitizePattern: string => string = (pattern: string) => {
    return "/" + pattern.replace(regex.regexControlChars, "");
  };

  // TODO: Need to support parameters other than 'id'
  const idPlaceholderRegex: RegExp = new RegExp("\\(.+\\)");
  const generateTemplateFunc: string => TemplateFunc = (pattern: string) => {
    const scrubbed: string = sanitizePattern(pattern);
    const templateText: string = scrubbed.replace(idPlaceholderRegex, "${id}");
    const template: TemplateFunc = _.template(templateText);
    return templateArgs => template(templateArgs || { id: "" });
  };

  const fromPythonRegex: string => RegExp = (pattern: string) => {
    const newPattern: string = pattern.replaceAll("?P", "?");
    return new RegExp(newPattern);
  };

  return _.mapKeys(
    urls_vx.map(entry =>
      Object.assign(entry, {
        name: entry.name,
        regex: fromPythonRegex(entry.pattern),
        pattern: sanitizePattern(entry.pattern),
        templateFunc: generateTemplateFunc(entry.pattern),
      })
    ),
    (urlPattern: UrlPattern) => urlPattern.name
  );
}

const urls: Dictionary<UrlPattern> = importUrls(urls_v2);

type SectionUrlArguments = {|
  section: string,
  args: Dictionary<string>,
|};

class urlHelper {
  static navigateToSection(section: string): void {
    UniversalDispatcher.dispatch({
      type: "SET_SECTION",
      section: section,
      url: urlHelper.section(section),
    });
  }

  /**
   *
   * @param section             Section to link to
   * @param args                Arguments for the section url
   * @param includeIdInArgs     Whether to include id in the arguments (default=false)
   * @returns url for the given section and its arguments
   */
  static section(
    section: string,
    args: ?Object,
    includeIdInArgs: boolean
  ): string {
    let sectionUrl: string = urlHelper._sectionSpecialCases(section, args);
    if (!_.isEmpty(sectionUrl)) {
      return sectionUrl;
    }
    sectionUrl = urls[section].templateFunc(args);
    if (args) {
      const _args = includeIdInArgs ? args : _.omit(args, "id");
      sectionUrl += _.reduce(
        _args,
        function(argsString, value, key) {
          const argSymbol: string = _.isEmpty(argsString) ? "?" : "&";
          return `${argsString}${argSymbol}${key}=${value}`;
        },
        ""
      );
    }
    return sectionUrl;
  }

  static _sectionSpecialCases(section: string, args: ?Object): string {
    // TODO: Fix the url template generators to handle these
    // TODO: Fix bug where calling section with an argument other than an id argument
    switch (section) {
      case Section.CreateEventProject:
        return `/events/${args["event_id"]}/projects/create/${args[
          "project_id"
        ] || ""}`;
      case Section.AboutEventProject:
        return `/events/${args["event_id"]}/projects/${args["project_id"]}`;
    }
  }

  // Determine if we are on a given section
  static atSection(section: string, url: ?string): string {
    let _url: string = url || window.location.href;
    return urlHelper.getSection(_url) === section;
  }

  // Determine which section we're on
  static getSection(url: ?string): ?string {
    let _url: string = url || window.location.href;
    let urlMatch: UrlPattern = urlHelper.getSectionUrlPattern(_url);
    return urlMatch && urlMatch.name;
  }

  static getSectionUrlPattern(url: ?string): ?UrlPattern {
    let _url: string = urlHelper._urlOrCurrentUrl(url);
    const pattern: UrlPattern = _.values(urls).find((urlPattern: UrlPattern) =>
      urlPattern.regex.test(_url)
    );
    return pattern || urls[Section.Home];
  }

  static getSectionArgs(url: ?string): SectionUrlArguments {
    let _url: string = url || window.location.href;
    let oldArgs: Dictionary<string> = urlHelper.arguments(_url);
    const args = {
      section: urlHelper.getSection(_url),
      args: _.omit(oldArgs, ["section"]),
    };
    return args;
  }

  static fromSectionArgs(args: SectionUrlArguments): string {
    return urlHelper.section(args.section, args.args);
  }

  static sectionOrLogIn(section: string): string {
    return CurrentUser.isLoggedIn()
      ? urlHelper.section(section)
      : urlHelper.section(Section.LogIn, { prev: section });
  }

  // Get url for logging in then returning to the previous page
  static logInThenReturn(returnUrl: ?string): string {
    let _url: string = returnUrl || window.location.href;
    const sectionArgs: SectionUrlArguments = urlHelper.getSectionArgs(_url);
    if ("prev" in sectionArgs.args) {
      return _url;
    } else {
      let _args: Dictionary<string> = {
        prev: sectionArgs.section!==Section.IframeProject ? sectionArgs.section : Section.AboutProject, // if login from within an iframe, go direct without iframe
      };
      if (!_.isEmpty(sectionArgs.args)) {
        _args.prevPageArgs = JSON.stringify(sectionArgs.args);
      }
      return urlHelper.section(Section.LogIn, _args, true);
    }
  }

  // Construct a url with properly-formatted query string for the given arguments
  static constructWithQueryString(
    url: string,
    args: Dictionary<string>
  ): string {
    let result: string = url;
    if (!_.isEmpty(args)) {
      result += url.indexOf("?") < 0 ? "?" : "&";
      result += _.keys(args)
        .map(key => key + "=" + args[key])
        .join("&");
    }
    return result;
  }

  static arguments(fromUrl: ?string): Dictionary<string> {
    // Take argument section of url and split args into substrings
    const url = urlHelper._urlOrCurrentUrl(fromUrl);
    let processedUrlPattern: ProcessedUrlPattern = urlHelper._regexArguments(
      url
    );
    let _arguments = processedUrlPattern ? processedUrlPattern.args : {};
    const argStart = url.indexOf("?");
    if (argStart > -1) {
      let args = url.slice(argStart + 1).split("&");
      // Pull the key and value out of each arg substring into array pairs of [key,value]
      let argMatches = args.map(arg => regex.argumentSplit.exec(arg));
      let argPairs = argMatches.map(argMatch => [argMatch[1], argMatch[2]]);
      // Remove section argument, if applicable
      _.remove(argPairs, argPair => argPair[0] === "section");
      // Construct object from array pairs
      _arguments = Object.assign(_arguments, _.fromPairs(argPairs));
    }

    return _arguments;
  }

  static _regexArguments(url: ?string): ProcessedUrlPattern {
    //TODO: Cache this result for the current page?
    let processedUrlPattern: ProcessedUrlPattern = null;
    let urlPattern: UrlPattern = _.values(urls).find((urlPattern: UrlPattern) =>
      urlPattern.regex.test(url)
    );
    if (urlPattern) {
      const matches = urlPattern.regex.exec(url);
      const args = matches.groups || {};
      processedUrlPattern = {
        url: url,
        args: args,
      };
    }
    return processedUrlPattern;
  }

  static argument(key: string): ?string {
    const args: Dictionary<string> = urlHelper.arguments();
    return args && args[key];
  }

  static update(newUrl: string): void {
    history.pushState({}, null, newUrl);
  }

  static updateArgs(
    args: Dictionary<string>,
    removeArgs: ?$ReadOnlyArray<string>,
    url: ?string
  ): string {
    let _url: string = url || window.location.href;
    let sectionArgs: SectionUrlArguments = urlHelper.getSectionArgs(_url);
    sectionArgs.args = Object.assign(sectionArgs.args, args);
    let newUrl: string = urlHelper.fromSectionArgs(sectionArgs);
    urlHelper.update(newUrl);
    return newUrl;
  }

  static removeArgs(args: $ReadOnlyArray<string>, url: ?string): string {
    let _url: string = url || window.location.href;
    let sectionArgs: SectionUrlArguments = urlHelper.getSectionArgs(_url);
    sectionArgs.args = _.omit(sectionArgs.args, args);
    let newUrl: string = urlHelper.fromSectionArgs(sectionArgs);
    urlHelper.update(newUrl);
    return newUrl;
  }

  static appendHttpIfMissingProtocol(url: string): string {
    // TODO: Find a library that can handle this so we don't have to maintain regexes
    if (!regex.protocol.test(url)) {
      url = "http://" + url;
    }
    return url;
  }

  static argsString(args: Dictionary<string>, startArgs: string): string {
    return _.reduce(
      args,
      function(argsString, value, key) {
        const prefix: string = !_.isEmpty(argsString) ? "&" : "?";
        return `${argsString}${prefix}${key}=${value}`;
      },
      startArgs || ""
    );
  }

  static beautify(url: string): string {
    // Remove http(s)
    return url.replace(regex.protocol, "");
  }

  static hostname(): string {
    return window.location.origin;
  }

  static isValidUrl(url: string): boolean {
    return isURL(url);
  }

  static isEmptyStringOrValidUrl(url: string): boolean {
    return _.isEmpty(url) || this.isValidUrl(url);
  }

  static cleanDemocracyLabUrl(url: ?string): string {
    // Remove url snippet
    let _url: string = url || window.location.href;
    return _url.replace("#_=_", "");
  }

  // TODO: Use this for every method
  static _urlOrCurrentUrl(url: ?string): string {
    return url || window.location.href;
  }

  static encodeNameForUrlPassing(name: string): string {
    return encodeURIComponent(name);
  }

  static decodeNameFromUrlPassing(name: string): string {
    return decodeURIComponent(name);
  }
}

export default urlHelper;
