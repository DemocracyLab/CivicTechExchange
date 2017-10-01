from django import forms
from .models import Project


class ProjectCreationForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = '__all__'
