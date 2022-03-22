// @flow

import type Moment from "moment";
import moment from "moment-timezone";

export const DateFormat: { [key: string]: string } = {
  DAY_MONTH_DATE_YEAR: "dddd, MMMM Do YYYY",
  DAY_MONTH_DATE_YEAR_TIME: "dddd, MMMM Do YYYY h:mm a z",
  MONTH_DATE_YEAR: "MMMM Do YYYY",
  TIME: "h:mm a",
  TIME_TIMEZONE: "h:mm a z",
};

export const timezone: string = moment.tz.guess();

class datetimeHelper {
  static now(): Moment {
    return moment();
  }

  static parse(dateString: string): Moment {
    return moment(dateString).tz(timezone);
  }

  static isOnSame(period: string, a: Moment, b: Moment): boolean {
    return a
      .clone()
      .startOf(period)
      .isSame(b.clone().startOf(period));
  }
}

export default datetimeHelper;
