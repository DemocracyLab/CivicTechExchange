from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.template import loader
from django.http import HttpResponse

from .forms import DemocracyLabUserCreationForm

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
        form = UserCreationForm()

    template = loader.get_template('signup.html')
    context = {'form': form}
    return HttpResponse(template.render(context, request))
    # return render(request, 'signup.html', {'form': form})
