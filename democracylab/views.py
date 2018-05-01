from django.contrib.auth import login, authenticate
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import redirect
from django.template import loader
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .forms import DemocracyLabUserCreationForm
from .models import Contributor, get_request_contributor


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
                last_name=form.cleaned_data.get('last_name'),
                email_verified=False
            )
            contributor.set_password(raw_password)
            contributor.save()
            user = authenticate(username=email, password=raw_password)
            login(request, user)
            contributor.send_verification_email()
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


def verify_user(request, user_id, token):
    # Get user info
    user = Contributor.objects.get(id=user_id)

    # Verify token
    if default_token_generator.check_token(user, token):
        # TODO: Add feedback from the frontend to indicate success/failure
        contributor = Contributor.objects.get(id=user_id)
        contributor.email_verified = True
        contributor.save()
        return redirect('/')
    else:
        return HttpResponse(status=401)


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def send_verification_email(request):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        user.send_verification_email()
        return HttpResponse(status=200)
    else:
        # If user's email was already confirmed
        return HttpResponse(status=403)
