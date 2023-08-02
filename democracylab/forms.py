import json
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import PermissionDenied
from .models import Contributor
from civictechprojects.models import ProjectLink, ProjectFile, FileCategory
from common.helpers.form_helpers import read_form_field_string, read_form_field_tags, merge_json_changes, merge_single_file
from common.helpers.qiqo_chat import SubscribeUserToQiqoChat
from salesforce import contact as salesforce_contact
from common.helpers.request_helpers import is_ajax


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
        form = None
        if is_ajax(request):
            form = json.loads(request.body)
        else:
            form = DemocracyLabUserCreationForm(request.POST)
        project_fields_changed |= read_form_field_string(user, form, 'first_name')
        project_fields_changed |= read_form_field_string(user, form, 'last_name')
        read_form_field_string(user, form, 'about_me')
        read_form_field_string(user, form, 'postal_code')
        read_form_field_string(user, form, 'country')

        read_form_field_tags(user, form, 'user_technologies')

        user.save()

        merge_json_changes(ProjectLink, user, form, 'user_links')
        merge_json_changes(ProjectFile, user, form, 'user_files')
        merge_single_file(user, form, FileCategory.THUMBNAIL, 'user_thumbnail')
        merge_single_file(user, form, FileCategory.RESUME, 'user_resume_file')

        if project_fields_changed:
            user.update_linked_items()

        SubscribeUserToQiqoChat(user)
        salesforce_contact.save(user)
        return user


class DemocracyLabUserAddDetailsForm(forms.Form):
    first_name = forms.CharField()
    last_name = forms.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
