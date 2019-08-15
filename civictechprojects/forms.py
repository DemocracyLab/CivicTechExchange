from django.forms import ModelForm
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from .models import Project, ProjectLink, ProjectFile, ProjectPosition, FileCategory, Group
from democracylab.emails import send_project_creation_notification
from democracylab.models import get_request_contributor
from common.models.tags import Tag
from common.helpers.form_helpers import is_creator_or_staff, is_co_owner_or_staff, read_form_field_string, read_form_field_boolean, \
    merge_json_changes, merge_single_file, read_form_field_tags


class ProjectCreationForm(ModelForm):
    class Meta:
        model = Project
        fields = '__all__'

    @staticmethod
    def create_project(request):

        form = ProjectCreationForm(request.POST)
        # TODO: Form validation
        project = Project.objects.create(
            project_creator=get_request_contributor(request),
            project_name=form.data.get('project_name'),
            project_short_description=form.data.get('project_short_description'),
            project_date_created=timezone.now(),
            project_url='',
            project_description='',
            project_location='',
            is_created=False
        )
        project = Project.objects.get(id=project.id)

        # Tag fields operate like ManyToMany fields, and so cannot
        # be added until after the object is created.
        Tag.merge_tags_field(project.project_issue_area, form.data.get('project_issue_area'))
        merge_single_file(project, form, FileCategory.THUMBNAIL, 'project_thumbnail_location')

        project.save()
        return project

    @staticmethod
    def delete_project(request, project_id):
        project = Project.objects.get(id=project_id)

        if not is_creator_or_staff(request.user, project):
            raise PermissionDenied()

        project.delete()

    @staticmethod
    def edit_project(request, project_id):
        project = Project.objects.get(id=project_id)

        if not is_co_owner_or_staff(request.user, project):
            raise PermissionDenied()

        form = ProjectCreationForm(request.POST)
        is_created_original = project.is_created
        read_form_field_boolean(project, form, 'is_created')

        read_form_field_string(project, form, 'project_description')
        read_form_field_string(project, form, 'project_description_solution')
        read_form_field_string(project, form, 'project_description_actions')
        read_form_field_string(project, form, 'project_short_description')
        read_form_field_string(project, form, 'project_location')
        read_form_field_string(project, form, 'project_name')
        read_form_field_string(project, form, 'project_url')

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

class GroupCreationForm(ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

    @staticmethod
    def create_group(request):

        form = GroupCreationForm(request.POST)
        # TODO: Form validation
        group = Group.objects.create(
            group_creator=get_request_contributor(request),
            group_date_created=timezone.now(),
            group_name=form.data.get('group_name'),
            group_short_description=form.data.get('group_short_description'),
            group_description=form.data.get('group_description'),
            group_location=form.data.get('group_location'),
            is_created=False
        )
        group = Group.objects.get(id=group.id)

        # TODO: confirm    
        merge_single_file(group, form, FileCategory.THUMBNAIL, 'group_thumbnail_location')

        group.save()
        return group

    @staticmethod
    def delete_group(request, group_id):
        group = Group.objects.get(id=group_id)

        if not is_creator_or_staff(request.user, group):
            raise PermissionDenied()

        group.delete()

    @staticmethod
    def edit_group(request, group_id):
        group = Group.objects.get(id=group_id)

        if not is_co_owner_or_staff(request.user, group):
            raise PermissionDenied()

        form = GroupCreationForm(request.POST)
        is_created_original = group.is_created
        read_form_field_boolean(group, form, 'is_created')

        read_form_field_string(group, form, 'group_description')
        read_form_field_string(group, form, 'group_short_description')
        read_form_field_string(group, form, 'group_location')
        read_form_field_string(group, form, 'group_name')

        if not request.user.is_staff:
            group.group_date_modified = timezone.now()

        group.save()

        merge_json_changes(ProjectLink, group, form, 'group_links')
        merge_json_changes(ProjectFile, group, form, 'group_files')

        merge_single_file(group, form, FileCategory.THUMBNAIL, 'group_thumbnail_location')

        # TODO
        #if is_created_original != group.is_created:
            #print('notifying group creation')
            #send_project_creation_notification(group)

        return group
