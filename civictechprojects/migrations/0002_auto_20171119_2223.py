# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-11-19 22:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('civictechprojects', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='project_issue_area',
            field=models.CharField(default='Political Reform', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='project_location',
            field=models.CharField(default='Seattle, WA', max_length=200),
            preserve_default=False,
        ),
    ]
