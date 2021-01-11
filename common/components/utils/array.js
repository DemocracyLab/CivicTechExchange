// @flow

class array {
  // Create new array with separator element between elements
  static join<T>(array: $ReadOnlyArray<T>, separator: T): Array<T> {
    let _array: Array<T> = [array[0]];
    for(let c = 1; c < array.length; ++c) {
      _array.push(separator);
      _array.push(array[c]);
    }
    return _array;
  }
}

export default array;