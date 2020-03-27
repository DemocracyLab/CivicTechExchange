// @flow

class async {
  /**
   * For actions that need to wait for libraries or resources to be initialized before executing them.
   *
   * readyFunc: Function that returns the value that will be passed into the execution function
   * doFunc: Function that executes when the value returned by readyFunc is truthy
   * timeout: Milliseconds to wait between tries
   * maxRetries(optional): Number of times to attempt a retry
   */
  static doWhenReady<T>(readyFunc: () => T, doFunc: (T) => void, timeout: number, maxRetries?: number): T {
    let value: T = readyFunc();
    let numTries: number = 0;
    if(!value) {
      let intervalId = null;
      let checkFunc: () => T = function() {
        value = readyFunc();
        if (value) {
          doFunc(value);
        }
        if (value || (maxRetries && (++numTries > maxRetries))) {
          window.clearInterval(intervalId);
        }
      };
      intervalId = window.setInterval(checkFunc, timeout);
    } else {
      doFunc(value);
    }
  }
  
  /**
   * Wait until a global(window) event has fired before performing the action.  Besides subscribing to the event,
   * it will also check window.democracyLabEvents for the event (in case event fired before the subscription was made)
   *
   * @param eventName  Name of the event to wait for
   * @param doFunc     Action to perform
   */
  static onEvent(eventName: string, doFunc: () => void): void {
    // Check event list first
    if (window.democracyLabEvents && eventName in window.democracyLabEvents) {
      doFunc();
    } else {
      // Otherwise add event listener
      window.addEventListener(eventName, () => {
        doFunc();
      });
    }
  }
}

export default async
