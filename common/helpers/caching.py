from common.helpers.constants import FrontEndSection
from common.helpers.front_end import section_url
from django_seo_js.helpers import update_cache_for_url


def update_cached_project_url(project_id):
    update_cached_url(section_url(FrontEndSection.AboutProject, {'id': project_id}))


# Update url cached with our 3rd party prerender service
def update_cached_url(url):
    print('caching ' + url)
    update_cache_for_url(url)
