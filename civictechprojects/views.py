from django.shortcuts import redirect
from django.http import HttpResponse
from django.template import loader
from time import time

from urllib import parse as urlparse
import simplejson as json
from django.views.decorators.csrf import csrf_exempt

from .models import Project
from common.helpers.s3 import presign_s3_upload, user_has_permission_for_s3_file, delete_s3_file
from common.models.tags import get_tags_by_category
from .forms import ProjectCreationForm
from common.models.tags import Tag


def tags(request):
    return HttpResponse(
        json.dumps(
            list(Tag.objects.values())
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


def project_signup(request):
    if not request.user.is_authenticated():
        return redirect('/signup')
    if request.method == 'POST':
        ProjectCreationForm.create_project(request)
        return redirect('/index/?section=MyProjects')
    else:
        form = ProjectCreationForm()

    template = loader.get_template('project_signup.html')
    issues = get_tags_by_category('Issue(s) Addressed')
    tag_map = to_tag_map(issues)
    context = {
        'form': form,
        'issues': json.dumps(tag_map)
    }
    return HttpResponse(template.render(context, request))


def project(request, project_id):
    project = Project.objects.get(id=project_id)
    template = loader.get_template('project.html')
    context = {'project': project}
    return HttpResponse(template.render(context, request))


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
    return HttpResponse(
        json.dumps(
            projects_with_issue_areas(
                list(projects.order_by('project_name').values())
            )
        )
    )


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
