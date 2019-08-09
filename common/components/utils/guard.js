// @ flow
// helpers to guard against accidental/unwanted repeatedly submitted actions, etc
import _ from 'lodash';

class Guard {
  static click(func: string, duration = 1000: number, options = {'leading': true}: object): string {
    return _.debounce(func, duration, options)
  }
}

export default Guard;
