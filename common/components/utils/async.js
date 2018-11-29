// @flow

class async {
  /**
   * For actions that need to wait for libraries or resources to be initialized before executing them.
   *
   * readyFunc: Function that returns the value that will be passed into the execution function
   * doFunc: Function that executes when the value returned by readyFunc is truthy
   * timeout: Milliseconds to wait between tries
   */
  static doWhenReady<T>(readyFunc: () => T, doFunc: (T) => void, timeout: number): T {
    let value: T = readyFunc();
    if(!value) {
      let intervalId = null;
      let checkFunc: () => T = function() {
        value = readyFunc();
        if(value) {
          doFunc(value);
          window.clearInterval(intervalId)
        }
      };
      intervalId = window.setInterval(checkFunc, timeout);
    } else {
      doFunc(value);
    }
  }
}

export default async
