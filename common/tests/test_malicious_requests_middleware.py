from unittest.mock import MagicMock, patch
from django.test import TestCase, override_settings

from common.helpers.malicious_requests import (
    MaliciousRequestsMiddleware,
    _ALWAYS_BLOCKED_METHODS,
    _LOG_THROTTLE_SECONDS,
)


def _make_request(method='GET', path='/', fwd=None):
    request = MagicMock()
    request.method = method
    request.get_full_path.return_value = path
    request.META = {'REMOTE_ADDR': '127.0.0.1'}
    if fwd is not None:
        request.headers = {'X-Forwarded-For': fwd}
    else:
        request.headers = {}
    return request


def _middleware(get_response=None):
    return MaliciousRequestsMiddleware(get_response or MagicMock(return_value=None))


@override_settings(MALICIOUS_URL_PATTERNS=None, MALICIOUS_FWD_PATTERNS=None)
class AlwaysBlockedMethodsTests(TestCase):
    def test_always_blocked_set_contents(self):
        self.assertIn('TRACE', _ALWAYS_BLOCKED_METHODS)
        self.assertIn('TRACK', _ALWAYS_BLOCKED_METHODS)

    def test_trace_is_blocked(self):
        mw = _middleware()
        response = mw(MagicMock(method='TRACE', get_full_path=MagicMock(return_value='/')))
        self.assertEqual(response.status_code, 400)

    def test_track_is_blocked(self):
        mw = _middleware()
        response = mw(MagicMock(method='TRACK', get_full_path=MagicMock(return_value='/')))
        self.assertEqual(response.status_code, 400)

    def test_get_is_allowed(self):
        mw = _middleware()
        req = _make_request('GET')
        mw(req)  # should not raise

    def test_post_is_allowed(self):
        mw = _middleware()
        mw(_make_request('POST'))

    def test_put_is_allowed(self):
        mw = _middleware()
        mw(_make_request('PUT'))

    def test_delete_is_allowed(self):
        mw = _middleware()
        mw(_make_request('DELETE'))

    def test_patch_is_allowed(self):
        mw = _middleware()
        mw(_make_request('PATCH'))

    def test_options_is_allowed(self):
        mw = _middleware()
        mw(_make_request('OPTIONS'))

    def test_head_is_allowed(self):
        mw = _middleware()
        mw(_make_request('HEAD'))


@override_settings(MALICIOUS_URL_PATTERNS=r'\.php$,/wp-admin', MALICIOUS_FWD_PATTERNS=None)
class UrlPatternTests(TestCase):
    def test_malicious_url_is_blocked(self):
        mw = _middleware()
        response = mw(_make_request(path='/index.php'))
        self.assertEqual(response.status_code, 400)

    def test_another_malicious_url_is_blocked(self):
        mw = _middleware()
        response = mw(_make_request(path='/wp-admin/login'))
        self.assertEqual(response.status_code, 400)

    def test_clean_url_is_allowed(self):
        mw = _middleware()
        mw(_make_request(path='/projects/123'))


@override_settings(MALICIOUS_URL_PATTERNS=None, MALICIOUS_FWD_PATTERNS=r'^10\.')
class FwdPatternTests(TestCase):
    def test_malicious_fwd_is_blocked(self):
        mw = _middleware()
        response = mw(_make_request(fwd='10.0.0.1'))
        self.assertEqual(response.status_code, 400)

    def test_malicious_fwd_header_takes_precedence_over_remote_addr(self):
        mw = _middleware()
        response = mw(_make_request(fwd='10.1.2.3'))
        self.assertEqual(response.status_code, 400)

    def test_clean_fwd_is_allowed(self):
        mw = _middleware()
        mw(_make_request(fwd='203.0.113.5'))

    def test_remote_addr_used_when_no_fwd_header(self):
        mw = _middleware()
        mw(_make_request())  # REMOTE_ADDR is 127.0.0.1, should not match ^10\.


@override_settings(MALICIOUS_URL_PATTERNS=None, MALICIOUS_FWD_PATTERNS=None)
class LogThrottlingTests(TestCase):
    def _trace_request(self):
        return MagicMock(method='TRACE', get_full_path=MagicMock(return_value='/'))

    @patch('common.helpers.malicious_requests.print')
    @patch('common.helpers.malicious_requests.time.monotonic')
    def test_repeated_blocks_within_window_log_once(self, mock_monotonic, mock_print):
        mock_monotonic.return_value = 0
        mw = _middleware()

        for _ in range(5):
            response = mw(self._trace_request())
            self.assertEqual(response.status_code, 400)

        self.assertEqual(mock_print.call_count, 1)

    @patch('common.helpers.malicious_requests.print')
    @patch('common.helpers.malicious_requests.time.monotonic')
    def test_block_after_window_logs_again_with_suppressed_count(self, mock_monotonic, mock_print):
        mw = _middleware()

        mock_monotonic.return_value = 0
        response = mw(self._trace_request())
        self.assertEqual(response.status_code, 400)

        mock_monotonic.return_value = 5
        for _ in range(3):
            response = mw(self._trace_request())
            self.assertEqual(response.status_code, 400)

        mock_monotonic.return_value = _LOG_THROTTLE_SECONDS + 1
        response = mw(self._trace_request())
        self.assertEqual(response.status_code, 400)

        self.assertEqual(mock_print.call_count, 2)
        second_call_msg = mock_print.call_args_list[1].args[0]
        self.assertIn('+3 more suppressed', second_call_msg)

    @patch('common.helpers.malicious_requests.print')
    @patch('common.helpers.malicious_requests.time.monotonic')
    def test_different_block_reasons_throttle_independently(self, mock_monotonic, mock_print):
        mock_monotonic.return_value = 0
        mw = _middleware()

        response = mw(self._trace_request())
        self.assertEqual(response.status_code, 400)
        response = mw(MagicMock(method='TRACK', get_full_path=MagicMock(return_value='/')))
        self.assertEqual(response.status_code, 400)

        self.assertEqual(mock_print.call_count, 2)
