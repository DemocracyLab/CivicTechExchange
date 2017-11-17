class cx {
  constructor(prefix) {
    this._prefix = prefix;
  }

  get(...classnames) {
    return this._prefix + classnames.join(' ' + this._prefix);
  }
}

export default cx;
