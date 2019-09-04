// @ flow
// helpers to guard against accidental/unwanted repeatedly submitted actions, etc
import _ from 'lodash';

class Guard {
  static duplicateInput(func: string, duration: number = 1000, options: object = {'leading': true}): string {
    return _.debounce(func, duration, options)
  }
}

export default Guard;
