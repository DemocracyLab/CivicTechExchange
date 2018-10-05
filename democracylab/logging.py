import copy
import logging
import traceback


def dump(obj):
    for attr in dir(obj):
        print("obj.%s = %r" % (attr, getattr(obj, attr)))


def dump_request_summary(request):
    user = request.user.username if request.user.is_authenticated() else ''
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
        exception_info = traceback.format_exc()
        request_info = dump_request_summary(record.request)
        print('ERROR: {exception_info} REQUEST: {request_info}'.format(exception_info=exception_info, request_info=request_info))
