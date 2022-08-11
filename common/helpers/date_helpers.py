from datetime import datetime
from enum import Enum


class DateTimeFormats(Enum):
    UTC_DATETIME = '%Y-%m-%dT%H:%M:%SZ'
    DATE_LOCALIZED = '%x'
    DATEPICKER_DATE = '%a %b %d %Y %H:%M:%S GMT%z'
    MONTH_DD_YYYY = '%B %d, %Y'
    SCHEDULED_DATE_TIME = '[%A, %B %d, %Y] at [%H:%M:%S %Z]'
    SALESFORCE_DATE = '%Y-%m-%d'


def datetime_field_to_datetime(field):
    # For some reason django's DateTimeField's are sometimes rendered as plain strings, so we need to parse them back into datetimes
    if isinstance(field, str):
        return datetime.strptime(field, DateTimeFormats.UTC_DATETIME.value)
    else:
        return field


def datetime_to_string(date_time, date_time_format):
    return date_time.strftime(date_time_format.value)


def parse_front_end_datetime(date_str):
    # Example date string: Mon Feb 03 2020 18:30:00 GMT-0800 (Pacific Standard Time)
    # First chop off extraneous timezone name at the end
    pruned_date_str = date_str[0: date_str.index('(') - 1]
    # Parse according to format
    return datetime.strptime(pruned_date_str, DateTimeFormats.DATEPICKER_DATE.value)
