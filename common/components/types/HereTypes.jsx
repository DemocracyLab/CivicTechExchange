// @flow

type HereOptions = {|
  apiKey: string
|};

export type HereAutocompleteParams = {|
  query: string,
  maxresults: ?number,
  country: ?string,
  beginHighlight: ?string,
  endHighlight: ?string
|} & HereOptions;

export type HereAutocompleteResponse = {|
  suggestions: $ReadOnlyArray<HereSuggestion>
|};

export type HereSuggestion = {|
  address: HereAddress,
  countryCode: string,
  label: string,
  language: string,
  locationId: string,
  matchLevel: string
|};

export type HereAddress = {|
  country: string,
  city: ?string,
  county: ?string,
  district: ?string,
  postalCode: ?string,
  state: ?string,
  street: ?string,
  houseNumber: ?string
|};

export type HereGeocodeParams = {|
  locationId: string
|} & HereOptions;

export type HereGeocodeResponse = {|
// for now the only information we're interested in is inside Response.View[0].Result[0].Location
  Response: {|
    View: $ReadOnlyArray< {|
      Result: $ReadOnlyArray< {|
        Location: HereGeocodeResponseLocation
      |} >
    |} >
  |}
|};

export type HereGeocodeResponseLocation = {|
  LocationId: string,
  DisplayPosition: HereGeocodeResponseDisplayPosition,
  Address: HereGeocodeResponseAddress
|};

export type HereGeocodeResponseDisplayPosition = {|
  Latitude: number,
  Longitude: number
|};

export type HereGeocodeResponseAddress = {|
  Label: string,
  Country: string,
  State: string,
  County: string,
  City: string,
  District: string,
  Street: string,
  HouseNumber: string,
  PostalCode: string,
  AdditionalData: $ReadOnlyArray<{|value:string,key:string|}>
|};