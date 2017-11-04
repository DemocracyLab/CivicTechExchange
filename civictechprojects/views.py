from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse
from django.template import loader
from time import time
from django.db.models import Q
from .serializers import ProjectSerializer

from urllib import parse as urlparse
from pprint import pprint

from .models import Project
from common.helpers.s3 import presign_s3_upload
from democracylab.models import get_request_contributor

from .forms import ProjectCreationForm


class Tag:
    pass

def tag(name):
    res = Tag()
    res.tag_name = name.lower().replace(' ', '_')
    res.display_name = name
    return res

def tags(*tags):
    return [tag(t) for t in tags]
PROJECT_KINDS = tags(
    '1st Amendment',
    '2nd Amendment',
    'Cultural Issues',
    'Economy',
    'Education',
    'Environment',
    'Health Care',
    'Homelessness',
    'Housing',
    'Immigration',
    'International Issues',
    'National Security',
    'Political Reform',
    'Public Safety',
    'Social Justice',
    'Taxes',
    'Transportation',
    'Other'
)


def to_columns(items, count = 3):
    res = []
    for i in range(count):
        res.append([])
    cur = 0
    for item in items:
        res[cur % count].append(item)
        cur+=1
    return res


def to_rows(items, width):
    rows = [[]]
    row_number = 0
    column_number = 0
    for item in items:
        rows[row_number].append(item)
        if ++column_number >= width:
            column_number = 0
            rows.append([])
            ++row_number
    return rows

def project_signup(request):
    if request.user.is_anonymous():
        return redirect('login')
    if request.method == 'POST':
        form = ProjectCreationForm(request.POST)
        form.is_valid()
        # pprint(vars(request._post))
        # TODO: Form validation
        project = Project(
            project_creator=get_request_contributor(request),
            project_name=form.cleaned_data.get('project_name'),
            project_url=form.cleaned_data.get('project_url'),
            project_description=form.cleaned_data.get('project_description'),
            project_tags=form.cleaned_data.get('project_tags'),
        )
        project.save()
        return redirect('/')
    else:
        form = ProjectCreationForm()

    template = loader.get_template('project_signup.html')
    context = {'form': form,
        'projects':to_columns(PROJECT_KINDS)
    }
    return HttpResponse(template.render(context, request))


def projects(request):
    template = loader.get_template('projects.html')
    url_parts = request.GET.urlencode()
    query_terms = urlparse.parse_qs(url_parts, keep_blank_values=0, strict_parsing=0)
    projects = Project.objects
    if 'search' in query_terms:
        search_query = (query_terms['search'])[0]
        search_tags = search_query.split(',')
        for tag in search_tags:
            print('filtering by ' + str(tag))
            projects = projects.filter(Q(project_name__contains=tag) | Q(project_tags__name__contains=tag))
    projects = projects.order_by('-project_name')
    context = {'projects':to_rows(projects,4), 'user':request.user}
    return HttpResponse(template.render(context, request))


def home(request):
    template = loader.get_template('home.html')
    context = {}
    return HttpResponse(template.render(context, request))


def projects_list(request):
    if request.method == 'GET':
        projects = Project.objects.order_by('-project_name')
    serializer = ProjectSerializer(projects, many=True)
    return JsonResponse(serializer.data, safe=False)


def presign_project_thumbnail_upload(request):
    uploader = request.user.username
    file_type = request.GET['file_type']
    file_extension = file_type.split('/')[-1]
    unique_file_name = 'project_thumbnail_' + str(time())
    s3_key = 'thumbnails/%s/%s.%s' % (uploader, unique_file_name, file_extension)
    return presign_s3_upload(key=s3_key, file_type=file_type, acl="public-read")
