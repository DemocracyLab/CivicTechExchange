from django.contrib.auth.forms import UserCreationForm
from django import forms
from civictechprojects.models import Project
class DemocracyLabUserCreationForm(UserCreationForm):
    pass


class ProjectCreationForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ('project_name',)
        field_classes = {'project_name':forms.CharField}
