# Generated by Django 4.2 on 2023-11-15 01:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('civictechprojects', '0066_hackathons'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dollarssaved',
            old_name='public_value_created',
            new_name='impact',
        ),
        migrations.RenameField(
            model_name='dollarssaved',
            old_name='year',
            new_name='quarterly',
        ),
    ]
