# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('civictechprojects', '0024_auto_20190326_0057'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='volunteerrelation',
            name='deleted',
            field=models.BooleanField(default=False)
        )
    ]
