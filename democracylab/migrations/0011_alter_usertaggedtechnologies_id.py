# Generated by Django 4.2 on 2023-10-26 22:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("democracylab", "0010_alter_usertaggedtechnologies_tag"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usertaggedtechnologies",
            name="id",
            field=models.BigAutoField(
                auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
            ),
        ),
    ]
