from django.core.management.base import BaseCommand
from django.utils import timezone
from civictechprojects.models import UserAlert, UserAlertHistory, ProjectPosition
from civictechprojects.helpers.search.projects import projects_by_date_modified

# TODO: move to docker env var
ALERT_FREQUENCY = 1 # flag to indicate date range when checking new projects

class Command(BaseCommand):
    def handle(self, *args, **options):
        end_date = timezone.now()
        start_date = end_date - timezone.timedelta(days=ALERT_FREQUENCY)
        recent_project_list = projects_by_date_modified(start_date, end_date)
        print("Recent projects", recent_project_list)
        # get alert list
        alert_list = UserAlert.objects.all()
        for alert in alert_list:
            matching_projects = find_matching_projects(alert, recent_project_list)
            print("alert {} with filters {} has matching project list {}".format(alert, alert.filters, matching_projects))
            # TODO: send email here
            # save in alert history
            UserAlertHistory.create(alert, matching_projects, timezone.now())

def find_matching_projects(alert: UserAlert, project_list):
    issue_area_list = project_list.filter(project_issue_area__name__in=alert.alert_issue_area.slugs())
    technologies_list = project_list.filter(project_technologies__name__in=alert.alert_technologies.slugs())
    organization_type_list = project_list.filter(project_organization_type__name__in=alert.alert_organization_type.slugs())
    stage_list = project_list.filter(project_stage__name__in=alert.alert_stage.slugs())
    positions = (
        ProjectPosition.objects.filter(position_role__name__in=alert.alert_role.slugs())
        .exclude(position_event__isnull=False)
        .exclude(is_hidden=True)
        .select_related("position_project")
    )
    role_list = project_list.filter(positions__in=positions)
    return issue_area_list.union(
            technologies_list,
            organization_type_list,
            stage_list,
            role_list
        )
