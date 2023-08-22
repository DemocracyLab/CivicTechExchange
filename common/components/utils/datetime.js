// @flow

import type Moment from "moment";
import moment from "moment-timezone";

import { addDays, add } from "date-fns"; //parseISO
import { format, utcToZonedTime } from "date-fns-tz";
import { formatDistance } from "date-fns";

export const DateFormat: { [key: string]: string } = {
  DAY_MONTH_DATE_YEAR: "dddd, MMMM Do YYYY",
  DAY_MONTH_DATE_YEAR_TIME: "dddd, MMMM Do YYYY h:mm a z",
  MONTH_DATE_YEAR: "MMMM Do YYYY",
  TIME: "h:mm a",
  TIME_TIMEZONE: "h:mm a z",
};

export type duration = {|
  years: ?number,
  months: ?number,
  weeks: ?number,
  days: ?number,
  hours: ?number,
  minutes: ?number,
  seconds: ?number,
|};

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

  static formatInTimeZone(date: Date, strFormat: string, tz: string): string {
    return format(utcToZonedTime(date, tz), strFormat, { timeZone: tz });
  }

  static addToDate(date: Date, timeToAdd: duration): Date {
    return add(date, timeToAdd);
  }

  static getDisplayDistance(date1: Date, date2: Date) {
    //i-8999501
    let value = formatDistance(date1, date2); // converts to largest human readable value
    value = value.split(" ");
    if (Number.isNaN(parseInt(value[0]))) value.shift();
    if (parseInt(value[0]) == 1) value[0] = "a";
    value.push("ago");
    return value.join(" ");
  }
}

export default datetimeHelper;
