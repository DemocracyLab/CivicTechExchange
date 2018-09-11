import json
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import PermissionDenied
from .models import Contributor
from civictechprojects.models import ProjectLink, ProjectFile
from common.models.tags import Tag


#  'link_linkedin': 'http://www.linkedin.com',
#  'user_files': '',

#  'user_links': '[{"linkUrl":"http://www.google.com","linkName":"GOOGLE","visibility":"PUBLIC"},{"linkName":"link_linkedin","linkUrl":"http://www.linkedin.com","visibility":"PUBLIC"}]',
#  'user_resume_file': '',
#  'user_thumbnail_location': ''}

class DemocracyLabUserCreationForm(UserCreationForm):
    class Meta:
        model = Contributor
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @staticmethod
    def edit_user(request, user_id):
        user = Contributor.objects.get(id=user_id)

        if not request.user.username == user.username:
            raise PermissionDenied()

        form = DemocracyLabUserCreationForm(request.POST)
        user.about_me = form.data.get('about_me')
        user.postal_code = form.data.get('postal_code')
        user.country = form.data.get('country')
        user.first_name = form.data.get('first_name')
        user.last_name = form.data.get('last_name')

        Tag.merge_tags_field(user.user_technologies, form.data.get('user_technologies'))

        user.save()

        links_json_text = form.data.get('user_links')
        if len(links_json_text) > 0:
            links_json = json.loads(links_json_text)
            ProjectLink.merge_changes(user, links_json)

        files_json_text = form.data.get('user_files')
        if len(files_json_text) > 0:
            files_json = json.loads(files_json_text)
            ProjectFile.merge_changes(user, files_json)
