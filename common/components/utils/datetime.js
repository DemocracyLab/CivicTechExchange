// @flow

import type Moment from 'moment';
import moment from "moment-timezone";

export const DateFormat: {[key: string]: string} = {
  DAY_MONTH_DATE_YEAR: "dddd, MMMM Do YYYY",
  MONTH_DATE_YEAR: "MMMM Do YYYY",
  TIME: "h:mm a",
  TIME_TIMEZONE: "h:mm a z",
};

export const timezone: string = moment.tz.guess();

class datetimeHelper {
  static parse(dateString: string): Moment {
    return moment(dateString).tz(timezone);
  }
}

export default datetimeHelper;
