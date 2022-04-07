// @flow
import apiHelper, { APIError } from "./api.js";
import type {
  HereAutocompleteParams,
  HereAutocompleteResponse,
  HereGeocodeParams,
  HereGeocodeResponse,
} from "../types/HereTypes.jsx";
import urlHelper from "./url.js";
import _ from "lodash";

type HereConfig = {|
  autocompleteUrl: string,
  geocodeUrl: string,
  apiKey: string,
|};

export const hereConfig: HereConfig =
  window.HERE_CONFIG && JSON.parse(_.unescape(window.HERE_CONFIG));

class hereApiHelper {
  static autocompleteRequest(
    options: HereAutocompleteParams,
    successCallback: HereAutocompleteResponse => void,
    errCallback: APIError => void
  ) {
    const defaultOptions: HereAutocompleteParams = {
      maxresults: 5,
    };
    const _options: HereAutocompleteParams = Object.assign(
      {},
      defaultOptions,
      hereApiHelper._getCredentials(),
      options
    );
    hereApiHelper._request(
      hereConfig.autocompleteUrl,
      _options,
      successCallback,
      errCallback
    );
  }

  static geocodeRequest(
    options: HereGeocodeParams,
    successCallback: HereGeocodeResponse => void,
    errCallback: APIError => void
  ) {
    const _options: HereGeocodeParams = Object.assign(
      {},
      hereApiHelper._getCredentials(),
      options
    );
    hereApiHelper._request(
      hereConfig.geocodeUrl,
      _options,
      successCallback,
      errCallback
    );
  }

  static isConfigured(): boolean {
    return hereConfig && hereConfig.apiKey;
  }

  static _getCredentials(): HereOptions {
    return {
      apiKey: hereConfig.apiKey,
    };
  }

  static _request(
    url: string,
    args: Dictionary<string>,
    successCallback: ({||}) => void,
    errCallback: APIError => void
  ): void {
    const _url: string = url + urlHelper.argsString(args);
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const requestOptions = {
      credentials: "omit",
    };
    apiHelper._legacyRequest(
      _url,
      "GET",
      null,
      headers,
      successCallback,
      errCallback,
      requestOptions
    );
  }
}

export default hereApiHelper;
