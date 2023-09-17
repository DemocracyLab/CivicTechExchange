// @flow

import { format as format_tz, utcToZonedTime } from "date-fns-tz";

import {
  addDays,
  add,
  formatDistance,
  format,
  getTime,
  isSameDay,
  startOfDay,
  differenceInMilliseconds,
  milliseconds,
} from "date-fns";

//date-fns   datetime Date  /utils/datetime.js

export const DateFormat: { [key: string]: string } = {
  DAY_MONTH_DATE_YEAR: "EEEE, MMMM do yyyy",
  DAY_MONTH_DATE_YEAR_TIME: "EEEE, MMMM do yyyy h:mm aaa zzz",
  MONTH_DATE_YEAR: "MMMM do yyyy",
  TIME: "h:mm aaa",
  TIME_TIMEZONE: "h:mm aaa zzz",
  TIME_MONTH_DAY: "p MMM. d",
  // DAY_MONTH_DAY_YEAR: "EEEE, MMMM do, yyyy",
  DATE_TIME_ZULU: "yyyy-MM-dd'T'HH':'mm':'ss'Z'",
  DAY_MONTH_YEAR: "d MMM yyyy",
  MONTH_DAY_YEAR: "M/d/yyyy",
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
export const timezone: string = Intl.DateTimeFormat().resolvedOptions()
  .timeZone;

class datetimeHelper {
  static parse(dateString: string): Number {
    return getTime(utcToZonedTime(new Date(dateString), timezone));
  }

  static getMillisecondsFromDuration(duration: Duration): Number {
    return milliseconds(duration);
  }

  static getDifferenceInMilliseconds(date1: Date, date2: Date): Number {
    return differenceInMilliseconds(date1, date2);
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }

  static startOfDay(date: Date, strFormat: string) {
    return format(startOfDay(date), strFormat);
  }

  static formatByString(date: Date, strFormat: string) {
    return format(date, strFormat);
  }

  static formatByStringUTC(date: Date, strFormat: string) {
    return format_tz(utcToZonedTime(date, timezone), strFormat, {
      timeZone: "UTC",
    });
  }

  static formatbyStringWithTimeZone(date: Date, strFormat: string): string {
    return format_tz(utcToZonedTime(date, timezone), strFormat, {
      timeZone: timezone,
    });
  }

  static addToDate(date: Date, timeToAdd: duration): Date {
    return add(date, timeToAdd);
  }

  static getDisplayDistance(date1: Date, date2: Date) {
    let value = formatDistance(date1, date2); // converts to largest human readable value
    value = value.split(" ");
    if (parseInt(value[0]) == 1) value[0] = "a";
    value.push("ago");
    return value.join(" ");
  }
}

export default datetimeHelper;
