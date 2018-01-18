from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import Contributor


class DemocracyLabUserCreationForm(UserCreationForm):
    class Meta:
        model = Contributor
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = Contributor
        fields = '__all__'
