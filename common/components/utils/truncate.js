// @flow

import _ from "lodash";

class Truncate {

  static stringT(str: string, length: number): string {
    let dots: string = str.length > length ? "..." : "";
    return str.substring(0, length - dots.length) + dots;
  }
  
  static lines(str: string, lineLimit: number): string {
    let lines: Array<string> = str.split('\n', lineLimit);
    return lines.join("\n");
  }

  static arrayT(arr: Array<string>, length: number): Array<string> {
    if (arr.length > length) {
     let result: Array<string> = _.take(arr, length - 1);
     result.push((arr.length - length + 1) + " more");
     return result;
    } else {
      return arr;
    }
  }
}

export default Truncate;
