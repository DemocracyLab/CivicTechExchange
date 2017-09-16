from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.template import loader
from django.http import HttpResponse

from .forms import DemocracyLabUserCreationForm, ProjectCreationForm
#from common.models.tags import Tag

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

SKILL_KINDS = tags(
    'Accounting',
    'Back-End Development',
    'Business Strategy',
    'Copywriting',
    'Data Science',
    'Data Visualization',
    'Database Architecture',
    'Front-End Development',
    'Fundraising',
    'Graphic Design',
    'Legal Services',
    'Project Management',
    'Research',
    'UI Design',
    'UX Design',
    'Other'
)

TECHNOLOGIES = tags(
    'Python',
    'C',
    'Java',
    'C++',
    'C#,'
    'R',
    'JavaScript',
    'PHP',
    'Go',
    'Swift'
)

STAGES = tags(
    'New Idea',
    'Research',
    'Requirements Gathering and Analysis',
    'Planning',
    'Design',
    'Development',
    'Release',
    'Iteration',
)

PROJECT_TYPES = tags(
    'Government Efficiency',
    'Civic Engagement',
    'Community Organizing',
    'Infrastructure'
)

def to_columns(items):
    res = [[], [], []]
    cur = 0
    for item in items:
        res[cur % 3].append(item)
        cur+=1
    return res

def signup(request):
    if request.method == 'POST':
        form = DemocracyLabUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('home')
    else:
        form = DemocracyLabUserCreationForm()

    template = loader.get_template('signup.html')
    context = {'form': form,
        'skills':to_columns(SKILL_KINDS),
        'projects':to_columns(PROJECT_KINDS)
    }
    return HttpResponse(template.render(context, request))
    # return render(request, 'signup.html', {'form': form})

def project_signup(request):
    if request.method == 'POST':
        pass
    else:
        form = ProjectCreationForm()

    template = loader.get_template('project_signup.html')
    context = {'form': form,
        'skills':to_columns(SKILL_KINDS),
        'projects':to_columns(PROJECT_KINDS),
        'technologies':TECHNOLOGIES,
        'project_types':PROJECT_TYPES,
        'stages':STAGES
    }
    return HttpResponse(template.render(context, request))
