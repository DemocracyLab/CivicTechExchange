import datetime
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.template import loader
from django.http import HttpResponse
from django.contrib.messages import error, success

from .forms import DemocracyLabUserCreationForm, UserUpdateForm
from .models import Contributor

from pprint import pprint

# 10 minutes
USER_SESSION_EXPIRY_TIME = 600

def to_columns(items, count = 3):
    res = []
    for i in range(count):
        res.append([])
    cur = 0
    for item in items:
        res[cur % count].append(item)
        cur+=1
    return res

def login_view(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect('/')
        return render(request, 'login.html')
    try:
        user = Contributor.objects.get(username=request.POST['email'])
    except (KeyError, Contributor.DoesNotExist):
        error(request, 'A user with this email does not exist.')
        return redirect('login')
    if not user.check_password(request.POST['password']):
        error(request, 'Invalid password.')
        return redirect('login')
    user = authenticate(username=request.POST['email'], password=request.POST['password'])
    if user is not None:
       request.session.set_expiry(USER_SESSION_EXPIRY_TIME)
       login(request, user)
       return redirect('/')
    error(request, 'User login failed. User could not be authenticated')
    return redirect('login')

def signup(request):
    if request.method == 'POST':
        data = request.POST.copy()
        data['date_joined']=datetime.datetime.now()
        # Revisit if we don't use email as the username
        data['username']=data['email']
        form = DemocracyLabUserCreationForm(data)
        is_valid = form.is_valid()
        if not is_valid:
            error(request, form.errors)
            return redirect('signup')
        email = form.cleaned_data.get('email')
        password = form.cleaned_data.get('password1')
        contributor = Contributor(
            username=email,
            first_name=form.cleaned_data.get('first_name'),
            last_name=form.cleaned_data.get('last_name'),
            date_joined=form.cleaned_data.get('date_joined'),
        )
        contributor.set_password(password)
        contributor.save()
        user = authenticate(username=email, password=password)
        login(request, user)
        return redirect('/')
    elif request.method == 'GET':
        form = DemocracyLabUserCreationForm()

    context = {'form': form}
    return render(request, 'signup.html', context)

def user_update(request):
    if request.user.is_anonymous():
      return redirect('login')
    user = Contributor.objects.get(username=request.user)
    if request.method == 'POST':
        form = UserUpdateForm(request.POST)
        is_valid = form.is_valid()
        user.first_name = form.cleaned_data.get('first_name')
        user.last_name = form.cleaned_data.get('last_name')
        user.about_me=form.cleaned_data.get('about_me')
        user.phone_primary=form.cleaned_data.get('phone_primary')
        user.postal_code=form.cleaned_data.get('postal_code')
        user.website_url=form.cleaned_data.get('website_url')
        user.linkedin=form.cleaned_data.get('linkedin')
        user.facebook=form.cleaned_data.get('facebook')
        user.job_role=form.cleaned_data.get('job_role')
        user.behance=form.cleaned_data.get('behance')
        user.dribble=form.cleaned_data.get('dribble')
        user.experience_level=form.cleaned_data.get('experience_level')
        user.country=form.cleaned_data.get('country')
        user.other_url=form.cleaned_data.get('other_url')
        user.save()
        return redirect('/')

    context = {'user': user
        # 'skills':to_columns(SKILL_KINDS),
        # 'projects':to_columns(PROJECT_KINDS)
    }
    return render(request, 'aboutme.html', context)
