from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from .serializers import ProjectSerializer

from .models import Project

def home(request):
    template = loader.get_template('home.html')
    context = {}
    return HttpResponse(template.render(context, request))

# Create your views here.
def index(request):
    # raise EnvironmentError("Try this exception on for size")
    projects = Project.objects.order_by('-project_name')

    template = loader.get_template('projects.html')
    context = {
        'projects' : projects
    }
    return HttpResponse(template.render(context, request))

def projects_list(request):
    if request.method == 'GET':
        projects = Project.objects.order_by('-project_name')
    serializer = ProjectSerializer(projects, many=True)
    return JsonResponse(serializer.data, safe=False)
