from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.template import loader
from django.http import HttpResponse

from .forms import DemocracyLabUserCreationForm, ProjectCreationForm
from .models import Contributor

from pprint import pprint

from civictechprojects.views import PROJECTS

def to_columns(items, count = 3):
    res = []
    for i in range(count):
        res.append([])
    cur = 0
    for item in items:
        res[cur % count].append(item)
        cur+=1
    return res



def signup(request):
    if request.method == 'POST':
        form = DemocracyLabUserCreationForm(request.POST)
        is_valid = form.is_valid()
        pprint(vars(form))
        username = form.cleaned_data.get('username')
        raw_password = form.cleaned_data.get('password1')
        # TODO: Form validation
        contributor = Contributor(
            username=username,
            first_name=form.cleaned_data.get('first_name'),
            last_name=form.cleaned_data.get('last_name'),
            email=form.cleaned_data.get('email'),
            postal_code=form.cleaned_data.get('postal_code'),
            phone_primary=form.cleaned_data.get('phone_primary'),
            about_me=form.cleaned_data.get('about_me'),
        )
        contributor.set_password(raw_password)
        contributor.save()
        user = authenticate(username=username, password=raw_password)
        login(request, user)
        return redirect('/')
    else:
        form = DemocracyLabUserCreationForm()

    template = loader.get_template('signup.html')
    context = {'form': form,
        'skills':to_columns(SKILL_KINDS),
        'projects':to_columns(PROJECT_KINDS)
    }
    return HttpResponse(template.render(context, request))


def index(request):
    template = loader.get_template('index.html')
    print(to_columns(PROJECTS,4))
    context = {'projects':to_columns(PROJECTS,2)}
    return HttpResponse(template.render(context, request))
