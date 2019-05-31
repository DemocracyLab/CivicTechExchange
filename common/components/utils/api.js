// @flow

export type APIResponse = {|
  +status: number
|};

export type APIError = {|
  +errorCode: number,
  +errorMessage: string
|};