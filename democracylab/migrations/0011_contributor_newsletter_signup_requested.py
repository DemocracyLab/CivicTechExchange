from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('democracylab', '0010_alter_usertaggedtechnologies_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='contributor',
            name='newsletter_signup_requested',
            field=models.BooleanField(default=False),
        ),
    ]
