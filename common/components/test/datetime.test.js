import stringHelper from "../utils/string.js";
import datetime, { DateFormat } from "../utils/datetime.js";

describe("datetimehelper", () => {
  const event_date_start = "2020-05-22T01:00:00+00:00";
  const event_date_end = "2020-05-23T01:00:00+00:00";

  test("formating by string", () => {
    expect(
      datetime.formatByString(
        new Date(event_date_start),
        DateFormat.TIME_MONTH_DAY
      )
    ).toEqual("1:00 AM May. 22");
    expect(
      datetime.formatByString(
        new Date(event_date_start),
        DateFormat.DAY_MONTH_DATE_YEAR
      )
    ).toEqual("Friday, May 22nd 2020");
    expect(
      datetime.formatByString(
        new Date(event_date_start),
        DateFormat.DAY_MONTH_YEAR
      )
    ).toEqual("22 May 2020");
    expect(
      datetime.formatByStringUTC(
        new Date(event_date_start),
        DateFormat.DATE_TIME_ZULU
      )
    ).toEqual("2020-05-22T01:00:00Z");
  });

  test("adding duration to a date", () => {
    expect(datetime.addToDate(new Date(event_date_start), { days: 1 })).toEqual(
      new Date(event_date_end)
    );
  });

  test("getting Display Distance", () => {
    expect(
      datetime.getDisplayDistance(new Date(), new Date(event_date_start))
    ).toEqual("over 3 years ago");
    expect(
      datetime.getDisplayDistance(new Date(), new Date(event_date_end))
    ).toEqual("over 3 years ago");
  });
});
