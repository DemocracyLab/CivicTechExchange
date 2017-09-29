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

    def is_valid(self):
        return super().is_valid()


class ProjectCreationForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ('project_name',)
        field_classes = {'project_name':forms.CharField}