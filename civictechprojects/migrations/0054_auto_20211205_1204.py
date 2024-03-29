# Generated by Django 3.1.13 on 2021-12-05 12:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('civictechprojects', '0053_trelloaction_action_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trelloaction',
            name='action_type',
            field=models.CharField(max_length=1024),
        ),
        migrations.AlterField(
            model_name='trelloaction',
            name='board_id',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='trelloaction',
            name='id',
            field=models.CharField(max_length=256, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='trelloaction',
            name='member_fullname',
            field=models.CharField(max_length=1024),
        ),
        migrations.AlterField(
            model_name='trelloaction',
            name='member_id',
            field=models.CharField(max_length=256),
        ),
    ]
