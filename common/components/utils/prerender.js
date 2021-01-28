// @flow

class prerender {
  // Signal to prerender.io that the page has loaded all assets and is ready for caching.
  static ready(isReady = true): void {
    window.prerenderReady = isReady;
  }
}

export default prerender;
