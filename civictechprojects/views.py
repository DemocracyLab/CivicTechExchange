from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Project

# Create your views here.
def index(request):
    # raise EnvironmentError("Try this exception on for size")
    projects = Project.objects.order_by('-project_name')

    template = loader.get_template('projects.html')
    context = {
        'projects' : projects
    }
    return HttpResponse(template.render(context, request))