// @flow

class Truncate {

  static stringTruncate(str: string, length: number) {
    var dots = str.length > length ? "..." : "";
    return str.substring(0, length) + dots;
  }

  static arrayTruncate(arr: array, length: number) {
    if (arr.length > length) {
     let result = arr.slice(0, length-1)
     result.push("...")
     return result;
    } else {
      return arr;
    }
  }
}

export default Truncate;
