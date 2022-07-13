from common.helpers.constants import FrontEndSection
from common.helpers.front_end import section_url
from common.helpers.mailing_list import SubscribeToMailingList
from common.helpers.qiqo_chat import SubscribeUserToQiqoChat
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.tokens import default_token_generator
from django.contrib import messages
from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import simplejson as json
import ast
from .emails import send_verification_email, send_password_reset_email
from .forms import DemocracyLabUserCreationForm, DemocracyLabUserAddDetailsForm
from .models import Contributor, get_request_contributor, get_contributor_by_username
from .tokens import email_verify_token_generator
from oauth2 import registry
from salesforce import contact as salesforce_contact


def login_view(request, provider=None):
    provider_ids = [p.id for p in registry.get_list()]

    if request.method == 'POST':
        email = request.POST['username']
        password = request.POST['password']
        prev_page = request.POST['prevPage']
        prev_page_args_string = None
        if 'prevPageArgs' in request.POST and len(request.POST['prevPageArgs']) > 0:
            prev_page_args_string = request.POST['prevPageArgs'].strip('\'\"').replace('\\', '')
        user = authenticate(username=email.lower(), password=password)
        if user is not None and user.is_authenticated:
            login(request, user)
            prev_page_args = json.loads(prev_page_args_string) if prev_page_args_string else None
            redirect_url = '/' if prev_page.strip('/') == '' else section_url(prev_page, prev_page_args)
            return redirect(redirect_url)
        else:
            messages.error(request, 'Incorrect Email or Password')
            back_args = {'prev': prev_page}
            if prev_page_args_string:
                back_args['prevPageArgs'] = prev_page_args_string
            return redirect(section_url(FrontEndSection.LogIn, back_args))

    if provider in provider_ids:
        prev_page = request.GET['prevPage'] if 'prevPage' in request.GET else ''
        prev_page_args_string = None
        if 'prevPageArgs' in request.GET and len(request.GET['prevPageArgs']) > 0:
            prev_page_args_string = request.GET['prevPageArgs'].strip('\'\"').replace('\\', '')
        prev_page_args = json.loads(prev_page_args_string) if prev_page_args_string else None
        request.session['prev_page'] = prev_page
        request.session['prev_page_args'] = prev_page_args
        return redirect(f'{provider}_login')

    else:
        return redirect(section_url(FrontEndSection.LogIn))


def logout_view(request):
    logout(request)
    return redirect('/')
    

def signup(request):
    if request.method == 'POST':
        form = DemocracyLabUserCreationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            # TODO: Form validation
            contributor = Contributor(
                username=email.lower(),
                email=email.lower(),
                first_name=form.cleaned_data.get('first_name'),
                last_name=form.cleaned_data.get('last_name'),
                email_verified=False
            )
            contributor.set_password(raw_password)
            contributor.save()
            user = authenticate(username=contributor.username, password=raw_password)
            login(request, user)
            send_verification_email(contributor)

            subscribe_checked = form.data.get('newsletter_signup')
            if subscribe_checked:
                SubscribeToMailingList(email=contributor.email, first_name=contributor.first_name,
                                       last_name=contributor.last_name)

            SubscribeUserToQiqoChat(contributor)

            return redirect(section_url(FrontEndSection.SignedUp))
        else:
            errors = json.loads(form.errors.as_json())

            # inform server console of form invalidity
            print('Invalid form', errors)

            # inform client of form invalidity
            for fieldName in errors:
                fieldErrors = errors[fieldName]
                for fieldError in fieldErrors:
                    messages.error(request, fieldError['message'])

            return redirect(section_url(FrontEndSection.SignUp))
    else:
        return redirect(section_url(FrontEndSection.SignUp))


def add_signup_details(request):
    contributor = get_request_contributor(request)
    form = DemocracyLabUserAddDetailsForm(request.POST)
    if form.is_valid():
        contributor.first_name = form.cleaned_data.get('first_name')
        contributor.last_name = form.cleaned_data.get('last_name')
        contributor.save()

        # SubscribeUserToQiqoChat(contributor)
    else:
        errors = json.loads(form.errors.as_json())

        # inform server console of form invalidity
        print('Invalid form', errors)

        # inform client of form invalidity
        for fieldName in errors:
            fieldErrors = errors[fieldName]
            for fieldError in fieldErrors:
                messages.error(request, fieldError['message'])

        return redirect(section_url(FrontEndSection.AddUserDetails))

    return redirect(section_url(FrontEndSection.Home))


def verify_user(request, user_id, token):
    # Get user info
    user = Contributor.objects.get(id=user_id)

    # Verify token
    if email_verify_token_generator.check_token(user, token):
        # TODO: Add feedback from the frontend to indicate success/failure
        contributor = Contributor.objects.get(id=user_id)
        contributor.email_verified = True
        contributor.save()
        if not Contributor.first_name.lower().__contains__('test') and not Contributor.last_name.lower().__contains__('test'):
            salesforce_contact.save(contributor)
        return redirect(section_url(FrontEndSection.EmailVerified))
    else:
        return HttpResponse(status=401)


def password_reset(request):
    username = request.POST['email']
    user = get_contributor_by_username(username)

    if user is not None:
        send_password_reset_email(user)
    else:
        # Failing silently to not alert
        print('Attempt to reset password for unregistered email: ' + username)

    messages.add_message(request, messages.INFO, 'Your request to reset your password has been received. If an account with that email exists, an email will be sent with a link to reset your password.')
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


def user_edit(request, user_id):
    if not request.user.is_authenticated:
        return redirect(section_url(FrontEndSection.LogIn))

    DemocracyLabUserCreationForm.edit_user(request, user_id)

    return redirect(section_url(FrontEndSection.Profile, {'id': user_id}))


def user_edit_details(request, user_id):
    user = DemocracyLabUserCreationForm.edit_user(request, user_id)
    return JsonResponse(user.hydrate_to_json())


def user_details(request, user_id):
    user = Contributor.objects.get(id=user_id)
    return JsonResponse(user.hydrate_to_json())


# TODO: Pass csrf token in ajax call so we can check for it
@csrf_exempt
def send_verification_email_request(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = get_request_contributor(request)
    if not user.email_verified:
        send_verification_email(user)
        if request.method == 'GET':
            return redirect(section_url(FrontEndSection.SignedUp))
        else:
            return HttpResponse(status=200)
    else:
        # If user's email was already confirmed
        return HttpResponse(status=403)
