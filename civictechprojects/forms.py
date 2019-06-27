import json
from django.forms import ModelForm
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from .models import Project, ProjectLink, ProjectFile, ProjectPosition, FileCategory
from democracylab.emails import send_project_creation_notification
from democracylab.models import get_request_contributor
from common.models.tags import Tag
from common.helpers.form_helpers import is_creator_or_staff, is_co_owner_or_staff, read_form_field_string, merge_json_changes, merge_single_file


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
            project_description=form.data.get('project_description'),
            project_short_description=form.data.get('project_short_description'),
            project_location=form.data.get('project_location'),
            project_name=form.data.get('project_name'),
            project_url=form.data.get('project_url'),
            project_date_created=timezone.now()
        )
        project = Project.objects.get(id=project.id)

        # Tag fields operate like ManyToMany fields, and so cannot
        # be added until after the object is created.
        issue_areas = form.data.get('project_issue_area')
        if issue_areas and len(issue_areas) != 0:
            project.project_issue_area.add(issue_areas)

        project_stage = form.data.get('project_stage')
        if project_stage and len(project_stage) != 0:
            project.project_stage.add(project_stage)

        project_technologies = form.data.get('project_technologies')
        if len(project_technologies) > 0:
            for tech in project_technologies.split(','):
                project.project_technologies.add(tech)

        project_organization = form.data.get('project_organization')
        if len(project_organization) > 0:
            for org in project_organization.split(','):
                project.project_organization.add(org)

        project.save()

        positions_json_text = form.data.get('project_positions')
        if len(positions_json_text) > 0:
            positions_json = json.loads(positions_json_text)
            for position_json in positions_json:
                position = ProjectPosition.create_from_json(project, position_json)

        links_json_text = form.data.get('project_links')
        if len(links_json_text) > 0:
            links_json = json.loads(links_json_text)
            for link_json in links_json:
                link = ProjectLink.from_json(project, link_json)
                link.save()

        files_json_text = form.data.get('project_files')
        if len(files_json_text) > 0:
            files_json = json.loads(files_json_text)
            for file_json in files_json:
                file = ProjectFile.from_json(project, FileCategory.ETC, file_json)
                file.save()

        project_thumbnail_location = form.data.get('project_thumbnail_location')
        if len(project_thumbnail_location) > 0:
            thumbnail_json = json.loads(project_thumbnail_location)
            thumbnail = ProjectFile.from_json(project, FileCategory.THUMBNAIL, thumbnail_json)
            thumbnail.save()

        # Notify the admins that a new project has been created
        send_project_creation_notification(project)

        messages.add_message(request, messages.INFO, 'Your project "' + project.project_name + '" is awaiting approval.  Expect a decision in the next business day.')

    @staticmethod
    def create_project_new(request):
        form = ProjectCreationForm(request.POST)
        # TODO: Form validation
        project = Project.objects.create(
            project_creator=get_request_contributor(request),
            project_name=form.data.get('project_name'),
            project_short_description=form.data.get('project_short_description'),
            project_date_created=timezone.now()
        )
        project = Project.objects.get(id=project.id)

        # Tag fields operate like ManyToMany fields, and so cannot
        # be added until after the object is created.
        Tag.merge_tags_field(project.project_issue_area, form.data.get('project_issue_area'))
        merge_single_file(project, form, FileCategory.THUMBNAIL, 'project_thumbnail_location')

        project.save()

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
        read_form_field_string(project, form, 'project_description')
        read_form_field_string(project, form, 'project_short_description')
        read_form_field_string(project, form, 'project_location')
        read_form_field_string(project, form, 'project_name')
        read_form_field_string(project, form, 'project_url')

        Tag.merge_tags_field(project.project_issue_area, form.data.get('project_issue_area'))
        Tag.merge_tags_field(project.project_stage, form.data.get('project_stage'))
        Tag.merge_tags_field(project.project_technologies, form.data.get('project_technologies'))
        Tag.merge_tags_field(project.project_organization, form.data.get('project_organization'))

        if not request.user.is_staff:
            project.project_date_modified = timezone.now()

        project.save()

        merge_json_changes(ProjectLink, project, form, 'project_links')
        merge_json_changes(ProjectFile, project, form, 'project_files')
        merge_json_changes(ProjectPosition, project, form, 'project_positions')

        merge_single_file(project, form, FileCategory.THUMBNAIL, 'project_thumbnail_location')

        # TODO: Notify the admins that a new project has been created after final creation step
        # send_project_creation_notification(project)
        # messages.add_message(request, messages.INFO, 'Your project "' + project.project_name + '" is awaiting approval.  Expect a decision in the next business day.')
