from django.forms import ModelForm
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from .models import Project, ProjectLink, ProjectFile, ProjectPosition, FileCategory, Event, Group
from .sitemaps import SitemapPages
from democracylab.emails import send_project_creation_notification, send_group_creation_notification
from democracylab.models import get_request_contributor
from common.helpers.date_helpers import parse_front_end_datetime
from common.helpers.form_helpers import is_creator_or_staff, is_co_owner_or_staff, read_form_field_string, read_form_field_boolean, \
    merge_json_changes, merge_single_file, read_form_field_tags, read_form_field_datetime, read_form_fields_point


class ProjectCreationForm(ModelForm):
    class Meta:
        model = Project
        fields = '__all__'

    @staticmethod
    def delete_project(request, project_id):
        project = Project.objects.get(id=project_id)

        if not is_creator_or_staff(request.user, project):
            raise PermissionDenied()

        project.delete()
        SitemapPages.update()

    @staticmethod
    def create_or_edit_project(request, project_id):
        form = ProjectCreationForm(request.POST)
        if project_id is not None:
            project = Project.objects.get(id=project_id)
        else:
            project = Project.objects.create(
                project_creator=get_request_contributor(request),
                project_name=form.data.get('project_name'),
                project_date_created=timezone.now(),
                is_created=False
            )

        if not is_co_owner_or_staff(request.user, project):
            raise PermissionDenied()

        is_created_original = project.is_created
        read_form_field_boolean(project, form, 'is_created')

        read_form_field_string(project, form, 'project_description')
        read_form_field_string(project, form, 'project_description_solution')
        read_form_field_string(project, form, 'project_description_actions')
        read_form_field_string(project, form, 'project_short_description')
        read_form_field_string(project, form, 'project_location')
        read_form_field_string(project, form, 'project_country')
        read_form_field_string(project, form, 'project_state')
        read_form_field_string(project, form, 'project_city')
        read_form_field_string(project, form, 'project_name')
        read_form_field_string(project, form, 'project_url')

        read_form_fields_point(project, form, 'project_location_coords', 'project_latitude', 'project_longitude')

        read_form_field_tags(project, form, 'project_issue_area')
        read_form_field_tags(project, form, 'project_stage')
        read_form_field_tags(project, form, 'project_technologies')
        read_form_field_tags(project, form, 'project_organization')
        read_form_field_tags(project, form, 'project_organization_type')

        if not request.user.is_staff:
            project.project_date_modified = timezone.now()

        project.save()

        merge_json_changes(ProjectLink, project, form, 'project_links')
        merge_json_changes(ProjectFile, project, form, 'project_files')
        merge_json_changes(ProjectPosition, project, form, 'project_positions')

        merge_single_file(project, form, FileCategory.THUMBNAIL, 'project_thumbnail_location')

        if is_created_original != project.is_created:
            print('notifying project creation')
            send_project_creation_notification(project)

        return project


class EventCreationForm(ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

    @staticmethod
    def create_or_edit_event(request, event_id):
        form = EventCreationForm(request.POST)
        if event_id is not None:
            event = Event.objects.get(id=event_id)
        else:
            event = Event.objects.create(
                event_creator=get_request_contributor(request),
                event_date_created=timezone.now(),
                event_name=form.data.get('event_name'),
                event_date_start=parse_front_end_datetime(form.data.get('event_date_start')),
                event_date_end=parse_front_end_datetime(form.data.get('event_date_end')),
                is_created=False,
                is_searchable=True
            )

        if not is_co_owner_or_staff(request.user, event):
            raise PermissionDenied()

        read_form_field_string(event, form, 'event_agenda')
        read_form_field_string(event, form, 'event_description')
        read_form_field_string(event, form, 'event_short_description')
        read_form_field_string(event, form, 'event_name')
        read_form_field_string(event, form, 'event_location')
        read_form_field_string(event, form, 'event_rsvp_url')
        read_form_field_string(event, form, 'event_live_id')

        read_form_field_datetime(event, form, 'event_date_start')
        read_form_field_datetime(event, form, 'event_date_end')

        read_form_field_boolean(event, form, 'is_searchable')
        read_form_field_boolean(event, form, 'is_created')

        read_form_field_tags(event, form, 'event_legacy_organization')

        event.event_date_modified = timezone.now()

        merge_single_file(event, form, FileCategory.THUMBNAIL, 'event_thumbnail_location')

        event.save()

        return event

    @staticmethod
    def delete_event(request, event_id):
        event = Event.objects.get(id=event_id)

        if not is_creator_or_staff(request.user, event):
            raise PermissionDenied()

        event.delete()


class GroupCreationForm(ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

    @staticmethod
    def create_or_edit_group(request, group_id):
        form = GroupCreationForm(request.POST)
        if group_id is not None:
            group = Group.objects.get(id=group_id)
        else:
            group = Group.objects.create(
                group_creator=get_request_contributor(request),
                group_date_created=timezone.now(),
                group_name=form.data.get('group_name'),
                group_short_description=form.data.get('group_short_description'),
                group_description=form.data.get('group_description'),
                is_created=False
            )

        if not is_co_owner_or_staff(request.user, group):
            raise PermissionDenied()

        is_created_original = group.is_created
        read_form_field_boolean(group, form, 'is_created')

        read_form_field_string(group, form, 'group_description')
        read_form_field_string(group, form, 'group_short_description')
        read_form_field_string(group, form, 'group_country')
        read_form_field_string(group, form, 'group_location')
        read_form_field_string(group, form, 'group_state')
        read_form_field_string(group, form, 'group_city')
        read_form_field_string(group, form, 'group_name')
        read_form_field_string(group, form, 'group_url')

        read_form_fields_point(group, form, 'group_location_coords', 'group_latitude', 'group_longitude')

        if not request.user.is_staff:
            group.group_date_modified = timezone.now()

        group.save()

        merge_json_changes(ProjectLink, group, form, 'group_links')
        merge_json_changes(ProjectFile, group, form, 'group_files')

        merge_single_file(group, form, FileCategory.THUMBNAIL, 'group_thumbnail_location')

        if is_created_original != group.is_created:
            send_group_creation_notification(group)

        return group

    @staticmethod
    def delete_group(request, group_id):
        group = Group.objects.get(id=group_id)

        if not is_creator_or_staff(request.user, group):
            raise PermissionDenied()

        group.delete()