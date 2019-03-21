from datetime import datetime
from enum import Enum


class DateTimeFormats(Enum):
    UTC_DATETIME = '%Y-%m-%dT%H:%M:%SZ'
    DATE_LOCALIZED = '%x'


def datetime_field_to_datetime(field):
    # For some reason django's DateTimeField's are sometimes rendered as plain strings, so we need to parse them back into datetimes
    if isinstance(field, str):
        return datetime.strptime(field, DateTimeFormats.UTC_DATETIME.value)
    else:
        return field


def datetime_to_string(date_time, date_time_format):
    return date_time.strftime(date_time_format.value)