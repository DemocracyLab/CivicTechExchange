import copy
import logging
import traceback
import os
import psutil


def log_memory_usage():
    print('Memory Usage: {useInMb} MB'.format(useInMb=psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2))


def dump(obj):
    for attr in dir(obj):
        print("obj.%s = %r" % (attr, getattr(obj, attr)))


def dump_request_summary(request):
    user = (hasattr(request, 'user') and request.user.is_authenticated and request.user.username) or ''
    url = request.path
    method = request.method
    body = censor_sensitive_fields(dict(getattr(request, method)))

    return '({user}) {method} {url} {body}'.format(user=user, url=url, method=method, body=body)


sensitive_fields = ['password', 'password1', 'password2']


def censor_sensitive_fields(fields_dict):
    fields_copy = copy.deepcopy(fields_dict)
    for field in sensitive_fields:
        if field in fields_copy:
            censored_length = len(fields_copy[field][0])
            fields_copy[field][0] = '*' * censored_length

    return fields_copy


class CustomErrorHandler(logging.Handler):
    def emit(self, record):
        if record.exc_info:
            exctype, value, tb = record.exc_info
            exception_msg = {
                'exception_type': str(exctype),
                'message': str(traceback.format_tb(tb, 10)).replace('\\n', '').replace('\\', '')
            }
            error_msg = 'ERROR: {}'.format(str(exception_msg))
        else:
            error_msg = 'ERROR: {}'.format(record.getMessage())
    
        if hasattr(record, 'request'):
            error_msg += ' REQUEST: {}'.format(dump_request_summary(record.request))
        print(error_msg)

