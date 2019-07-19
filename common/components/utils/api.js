// @flow
import serialize from 'form-serialize';

export type APIResponse = {|
  +status: number
|};

export type APIError = {|
  +errorCode: number,
  +errorMessage: string
|};

class apiHelper {
  static post(url: string, body: {||}, successCallback: (APIResponse) => void, errCallback: (APIError) => void) {
    // TODO: Replace ProjectAPIUtils.post() and UserAPIUtils.post() with this method
    const bodyJson: string = JSON.stringify(body);
    
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    };
    apiHelper._request(url, "POST", bodyJson, headers, successCallback, errCallback);
  }
  
  static postForm(url: string, formNode: React.Ref, successCallback: (APIResponse) => void, errCallback: (APIError) => void) {
    const serializedForm = serialize(formNode.current, {empty: true, hash: false});
  
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    };
    apiHelper._request(url, "POST", serializedForm, headers, successCallback, errCallback);
  }
  
  static isSuccessResponse(response:APIResponse): boolean {
    return response.status < 400;
  }
  
  static _request(url: string, method: string, body: {||}, headers:{ [key: string]: string }, successCallback: ({||}) => void, errCallback: (APIError) => void): void {
    const doError = (response) => errCallback && errCallback({
      errorCode: response.status,
      errorMessage: JSON.stringify(response)
    });
  
    fetch(new Request(url, {method:method, body:body, credentials:"include", headers: headers}))
      .then(response => {
        if(!response.ok) {
          throw Error();
        }
        return response.json();
      })
      .then(responsePayload => successCallback && successCallback(responsePayload))
      .catch(response => doError(response));
  }
}

export default apiHelper;