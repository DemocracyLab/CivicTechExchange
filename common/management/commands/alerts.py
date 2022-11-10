from civictechprojects.models import UserAlert, UserAlertHistory
from civictechprojects.helpers.search.projects import projects_by_date_modified
from django.utils import timezone

# TODO: move to docker env var
ALERT_FREQUENCY = 1 # flag to indicate date range when checking new projects

def alert():
    end_date = timezone.now()
    start_date = end_date - timezone.timedelta(days=ALERT_FREQUENCY)
    recent_project_list = projects_by_date_modified(start_date, end_date)
    print("Recent projects", recent_project_list)
    # get alert list
    alert_list = UserAlert.objects.all()
    for alert in alert_list:
        matching_projects = find_matching_projects(alert, recent_project_list)
        # TODO: compare with previously sent alerts
        print("alert {} with filters {} has matching project list {}".format(alert, alert.filters, matching_projects))
        # save in alert history
        UserAlertHistory.create(alert, matching_projects, timezone.now())

def find_matching_projects(alert: UserAlert, project_list):
    return project_list.filter(project_issue_area__name__in=alert.alert_issue_area.slugs()) | \
        project_list.filter(project_issue_area__name__in=alert.alert_technologies.slugs()) | \
        project_list.filter(project_issue_area__name__in=alert.alert_role.slugs()) | \
        project_list.filter(project_issue_area__name__in=alert.alert_organization_type.slugs()) | \
        project_list.filter(project_issue_area__name__in=alert.alert_issue_area.slugs())
