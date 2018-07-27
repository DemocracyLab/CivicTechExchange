from django.contrib.auth import login, authenticate
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .forms import DemocracyLabUserCreationForm
from .models import Contributor, get_request_contributor, get_contributor_by_username


def login_view(request):
    if request.method == 'POST':
        email = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=email, password=password)
        if user is not None and user.is_authenticated:
            login(request, user)
            return redirect('/')
        else:
            # TODO: Show error message if the email/password combination are invalid
            return redirect('/index/?section=LogIn')
    else:
        return redirect('/index/?section=LogIn')


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
            return redirect('/index/?section=SignUp')
    else:
        return redirect('/index/?section=SignUp')


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

# def check_email(request):
#     user = authenticate(username = email, password = raw_password)
#     if not request.user.is_authenticated():
#         print('Incorrect Login Details')
#         return redirect('/?=errorpage')
    # else:
    #     return ... login/ show discover page


def password_reset(request):
    username = request.POST['email']
    user = get_contributor_by_username(username)

    if user is not None:
        user.send_password_reset_email()
    else:
        # Failing silently to not alert
        print('Attempt to reset password for unregistered email: ' + username)

    # TODO: Give the user an identical message whether email exists or not to prevent email harvesting
    print("We got to the end of password_reset")
    return redirect('/')


def change_password(request):
    user_id = request.POST['userId']
    token = request.POST['token']
    password = request.POST['password']
    # Get user info
    contributor = Contributor.objects.get(id=user_id)

    # Verify token
    if default_token_generator.check_token(contributor, token):
        contributor.set_password(password)
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
