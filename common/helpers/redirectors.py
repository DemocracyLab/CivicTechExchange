from urllib.parse import urlparse
from common.helpers.front_end import clean_invalid_args, get_clean_url, get_page_section, redirect_from_deprecated_url


class RedirectorInterface:
    @staticmethod
    def redirect_to(full_path):
        '''
        Redirects url to a new url, if redirection is needed

        :param full_path:   string containing full url path
        :return:            string path to redirect to, or None if no redirection is necessary
        '''
        pass


# Redirects away from invalid legacy arguments
class InvalidArgumentsRedirector(RedirectorInterface):
    @staticmethod
    def redirect_to(full_path):
        # Valid project URL path with invalid arguments should show page with canonical url
        url_args = urlparse(full_path)
        prefix_portion = url_args.netloc + url_args.path
        query_portion = url_args.query
        clean_url_args = clean_invalid_args(query_portion)
        if query_portion != "" and clean_url_args != '?' + query_portion:
            clean_url_valid_args = prefix_portion + clean_url_args
            print('Redirecting invalid arguments in {old_url} to {new_url}'.format(old_url=full_path, new_url=clean_url_valid_args))
            return clean_url_valid_args

# Redirects away from dirty urls
class DirtyUrlsRedirector(RedirectorInterface):
    @staticmethod
    def redirect_to(full_path):
        clean_url = get_clean_url(full_path)
        if clean_url != full_path:
            print('Redirecting unclean {old_url} to {new_url}'.format(old_url=full_path, new_url=clean_url))
            return clean_url

# Redirects away from deprecated urls
class DeprecatedUrlsRedirector(RedirectorInterface):
    @staticmethod
    def redirect_to(full_path):
        clean_url = get_clean_url(full_path)
        section_name = get_page_section(clean_url)
        deprecated_redirect_url = redirect_from_deprecated_url(section_name)
        if deprecated_redirect_url:
            print('Redirecting deprecated url {name}: {url}'.format(name=section_name, url=clean_url))
            return deprecated_redirect_url

def redirect_by(redirectors, full_path):
    for redirector in redirectors:
        redirect_result = redirector.redirect_to(full_path)
        if redirect_result is not None:
            return redirect_result
    return None
