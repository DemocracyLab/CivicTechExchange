# Generated by Django 3.1.13 on 2022-03-17 19:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('civictechprojects', '0055_auto_20220216_1751'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='event_created_from',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_projects', to='civictechprojects.event'),
        ),
    ]
