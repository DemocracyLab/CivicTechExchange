from django.contrib.auth import login, authenticate
from django.shortcuts import redirect
from django.template import loader
from django.http import HttpResponse

from .forms import DemocracyLabUserCreationForm
from .models import Contributor


def signup(request):
    if request.method == 'POST':
        form = DemocracyLabUserCreationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            # TODO: Form validation
            contributor = Contributor(
                username=email,
                email=email,
                first_name=form.cleaned_data.get('first_name'),
                last_name=form.cleaned_data.get('last_name')
            )
            contributor.set_password(raw_password)
            contributor.save()
            user = authenticate(username=email, password=raw_password)
            login(request, user)
            return redirect('/')
        else:
            # TODO inform client of form invalidity
            print('Invalid form', form.errors.as_json())
            template = loader.get_template('signup.html')
            context = {'errors': form.errors.as_json()}
            return HttpResponse(template.render(context, request))
    else:
        template = loader.get_template('signup.html')
        return HttpResponse(template.render({}, request))
