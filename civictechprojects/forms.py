import json
from django import forms
from django.core.exceptions import PermissionDenied
from .models import Project, ProjectLink, ProjectFile, FileCategory
from democracylab.models import get_request_contributor

class ProjectCreationForm(forms.Form):
    class Meta:
        fields = [
            'project_thumbnail_location',
            'project_name',
            'project_location',
            'project_url',
            'project_issue_area',
            'project_description',
            'project_links',
            'project_files'
        ]

    @staticmethod
    def create_project(request):
        form = ProjectCreationForm(request.POST)
        # TODO: Form validation
        project = Project.objects.create(
            project_creator=get_request_contributor(request),
            project_description=form.data.get('project_description'),
            project_location=form.data.get('project_location'),
            project_name=form.data.get('project_name'),
            project_url=form.data.get('project_url'),
        )
        project = Project.objects.get(id=project.id)

        issue_areas = form.data.get('project_issue_area')
        if len(issue_areas) != 0:
            # Tag fields operate like ManyToMany fields, and so cannot
            # be added until after the object is created.
            project.project_issue_area.add(issue_areas)

        project.save()

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

    @staticmethod
    def edit_project(request, project_id):
        project = Project.objects.get(id=project_id)

        if not request.user.username == project.project_creator.username:
            raise PermissionDenied()

        form = ProjectCreationForm(request.POST)
        project.project_description = form.data.get('project_description')
        project.project_location=form.data.get('project_location')
        project.project_name=form.data.get('project_name')
        project.project_url=form.data.get('project_url')
        project.save()

        links_json_text = form.data.get('project_links')
        if len(links_json_text) > 0:
            links_json = json.loads(links_json_text)
            ProjectLink.merge_changes(project, links_json)

        files_json_text = form.data.get('project_files')
        if len(files_json_text) > 0:
            files_json = json.loads(files_json_text)
            ProjectFile.merge_changes(project, files_json)
