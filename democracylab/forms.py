import json
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import PermissionDenied
from .models import Contributor
from civictechprojects.models import ProjectLink, ProjectFile, FileCategory
from common.models.tags import Tag


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

        user_thumbnail_location = form.data.get('user_thumbnail_location')
        if len(user_thumbnail_location) > 0:
            thumbnail_file_json = json.loads(user_thumbnail_location)
            ProjectFile.replace_single_file(user, FileCategory.THUMBNAIL, thumbnail_file_json)

        user_resume_file = form.data.get('user_resume_file')
        if len(user_resume_file) > 0:
            user_resume_file_json = json.loads(user_resume_file)
            ProjectFile.replace_single_file(user, FileCategory.RESUME, user_resume_file_json)