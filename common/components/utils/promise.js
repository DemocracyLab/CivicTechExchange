// @flow
import Promise from "bluebird";

class promiseHelper {
  /**
   * Return a dummy promise that returns the given value immediately
   */
  static return(value: any): Promise<any> {
    return new Promise(function(resolve) {
      resolve(value);
    });
  }

  /**
   * Return a promise that performs an action and continues unless an error occurs
   */
  static promisify(action: () => void): Promise {
    return new Promise((resolve, reject) => {
      try {
        action();
        resolve();
      } catch (e) {
        reject();
      }
    });
  }
}

export default promiseHelper;
