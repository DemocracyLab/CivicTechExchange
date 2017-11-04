from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import Contributor
from civictechprojects.models import Project

class DemocracyLabUserCreationForm(UserCreationForm):
    class Meta:
        model = Contributor
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Otherwise is_valid() complains that password is required
        del self.fields['password']

    def is_valid(self):
        return super().is_valid()


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = Contributor
        fields = '__all__'
