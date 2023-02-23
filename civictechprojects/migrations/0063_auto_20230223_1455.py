# Generated by Django 3.1.14 on 2023-02-23 14:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('democracylab', '0009_auto_20210302_2036'),
        ('civictechprojects', '0062_auto_20230112_0100'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectlink',
            name='link_title',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.CreateModel(
            name='VolunteerActivityReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_period_start', models.DateTimeField()),
                ('activity_period_end', models.DateTimeField()),
                ('hours_spent', models.DecimalField(decimal_places=2, max_digits=5)),
                ('activity_text', models.CharField(blank=True, max_length=1000)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='volunteer_activity_reports', to='civictechprojects.project')),
                ('volunteer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='volunteer_activity_reports', to='democracylab.contributor')),
            ],
        ),
    ]
