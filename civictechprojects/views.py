from django.shortcuts import redirect
from django.http import HttpResponse
from django.template import loader
from time import time

from urllib import parse as urlparse
import simplejson as json
from django.views.decorators.csrf import csrf_exempt

from .models import Project, ProjectFile, FileCategory, ProjectLink
from common.helpers.s3 import presign_s3_upload, user_has_permission_for_s3_file, delete_s3_file
from common.models.tags import get_tags_by_category
from .forms import ProjectCreationForm
from common.models.tags import Tag


def tags(request):
    url_parts = request.GET.urlencode()
    query_terms = urlparse.parse_qs(
        url_parts, keep_blank_values=0, strict_parsing=0)
    if 'category' in query_terms:
        category = query_terms.get('category')[0]
        tags = get_tags_by_category(category)
    else:
        tags = Tag.objects
    return HttpResponse(
        json.dumps(
            list(tags.values())
        )
    )


def to_rows(items, width):
    rows = [[]]
    row_number = 0
    column_number = 0
    for item in items:
        rows[row_number].append(item)
        column_number += 1
        if column_number >= width:
            column_number = 0
            rows.append([])
            row_number += 1
    return rows


def to_tag_map(tags):
    tag_map = ((tag.tag_name, tag.display_name) for tag in tags)
    return list(tag_map)


def project_create(request):
    if not request.user.is_authenticated():
        return redirect('/signup')

    ProjectCreationForm.create_project(request)
    return redirect('/index/?section=MyProjects')


def project_edit(request, project_id):
    # TODO: Throw error if unauthorized
    ProjectCreationForm.edit_project(request, project_id)
    return redirect('/index/?section=AboutProject&id=' + project_id)


# TODO: Remove when React implementation complete
def project(request, project_id):
    project = Project.objects.get(id=project_id)
    template = loader.get_template('project.html')
    files = ProjectFile.objects.filter(file_project=project_id)
    thumbnail_files = list(files.filter(file_category=FileCategory.THUMBNAIL.value))
    other_files = list(files.filter(file_category=FileCategory.ETC.value))
    links = ProjectLink.objects.filter(link_project=project_id)
    context = {
        'project': project,
        'files': map(lambda file: file.to_json(), other_files),
        'links': map(lambda link: link.to_json(), links),
    }
    if len(thumbnail_files) > 0:
        context['thumbnail'] = thumbnail_files[0].to_json()
    return HttpResponse(template.render(context, request))


def get_project(request, project_id):
    project = Project.objects.get(id=project_id)
    return HttpResponse(json.dumps(project.to_json()))


def projects(request):
    return redirect('/index/')
    template = loader.get_template('projects.html')
    url_parts = request.GET.urlencode()
    query_terms = urlparse.parse_qs(
        url_parts, keep_blank_values=0, strict_parsing=0)
    projects = Project.objects
    if 'search' in query_terms:
        search_query = (query_terms['search'])[0]
        search_tags = search_query.split(',')
        for tag in search_tags:
            print('filtering by ' + str(tag))
            projects = projects.filter(project_tags__name__in=[tag])
    projects = projects.order_by('-project_name')
    context = {'projects': to_rows(projects, 4)}
    return HttpResponse(template.render(context, request))


def home(request):
    template = loader.get_template('home.html')
    context = {}
    return HttpResponse(template.render(context, request))


def index(request):
    template = loader.get_template('new_index.html')
    context = (
        {
            'userID': request.user.id,
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
        }
        if request.user.is_authenticated() else
        {}
    )
    return HttpResponse(template.render(context, request))


def my_projects(request):
    projects = Project.objects.filter(project_creator_id=request.user.id)
    return HttpResponse(json.dumps(list(projects.values())))


def projects_list(request):
    if request.method == 'GET':
        url_parts = request.GET.urlencode()
        query_params = urlparse.parse_qs(
            url_parts, keep_blank_values=0, strict_parsing=0)
        projects = (
            projects_by_keyword(query_params)
            | projects_by_tag(query_params)
        ) if (
            'keyword' in query_params
            or 'tags' in query_params
        ) else Project.objects
    response = json.dumps(
        projects_with_issue_areas(
            list(projects.order_by('project_name').values())
        )
    )
    return HttpResponse(response)


def projects_by_keyword(query_params):
    return Project.objects.filter(
        project_description__icontains=(
            query_params['keyword'][0]
            )
        ) if 'keyword' in query_params else Project.objects.none()


def projects_by_tag(query_params):
    return Project.objects.filter(
        project_issue_area__name__in=(
            query_params['tags'][0].split(',')
            if 'tags' in query_params
            else []
            )
    )


def projects_with_issue_areas(list_of_projects):
    return [
        dict(
            project,
            project_issue_area=list(
                Project
                .objects
                .get(id=project['id']).project_issue_area.all().values())
            )
        for project in list_of_projects
    ]


def presign_project_thumbnail_upload(request):
    uploader = request.user.username
    file_type = request.GET['file_type']
    file_extension = file_type.split('/')[-1]
    unique_file_name = 'project_thumbnail_' + str(time())
    s3_key = 'thumbnails/%s/%s.%s' % (
        uploader, unique_file_name, file_extension)
    return presign_s3_upload(
        raw_key=s3_key, file_type=file_type, acl="public-read")


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def delete_uploaded_file(request, s3_key):
    uploader = request.user.username
    has_permisson = user_has_permission_for_s3_file(uploader, s3_key)

    if has_permisson:
        delete_s3_file(s3_key)
        return HttpResponse(status=202)
    else:
        # TODO: Log this
        return HttpResponse(status=401)
