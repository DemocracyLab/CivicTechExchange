import json
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import PermissionDenied
from .models import Contributor
from civictechprojects.models import ProjectLink, ProjectFile, FileCategory
from common.helpers.form_helpers import read_form_field_string
from common.helpers.qiqo_chat import SubscribeUserToQiqoChat
from common.models.tags import Tag
from salesforce import Salesforce

class DemocracyLabUserCreationForm(UserCreationForm):
    class Meta:
        model = Contributor
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @staticmethod
    def edit_user(request, user_id):
        user = Contributor.objects.get(id=user_id)

        if not (request.user.username == user.username or request.user.is_staff):
            raise PermissionDenied()

        project_fields_changed = False
        form = DemocracyLabUserCreationForm(request.POST)
        project_fields_changed |= read_form_field_string(user, form, 'first_name')
        project_fields_changed |= read_form_field_string(user, form, 'last_name')
        read_form_field_string(user, form, 'about_me')
        read_form_field_string(user, form, 'postal_code')
        read_form_field_string(user, form, 'country')

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
            project_fields_changed |= ProjectFile.replace_single_file(user, FileCategory.THUMBNAIL, thumbnail_file_json)

        user_resume_file = form.data.get('user_resume_file')
        if len(user_resume_file) > 0:
            user_resume_file_json = json.loads(user_resume_file)
            ProjectFile.replace_single_file(user, FileCategory.RESUME, user_resume_file_json)

        if project_fields_changed:
            user.update_linked_items()

        SubscribeUserToQiqoChat(user)
        Salesforce.contact.upsert_contact(user)


class DemocracyLabUserAddDetailsForm(forms.Form):
    first_name = forms.CharField()
    last_name = forms.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
