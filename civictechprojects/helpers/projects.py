from civictechprojects.models import Project, ProjectPosition
from common.helpers.dictionaries import merge_dicts
from collections import Counter

def projects_tag_counts():
    projects = Project.objects.all()
    issues, technologies, stage, organization, positions = [], [], [], [], []
    if projects:
        for project in projects:
            issues += project.project_issue_area.slugs()
            technologies += project.project_technologies.slugs()
            stage += project.project_stage.slugs()
            organization += project.project_organization.slugs()

            project_positions = ProjectPosition.objects.filter(position_project=project.id)
            positions += map(lambda position: position.position_role.slugs()[0], project_positions)

        return merge_dicts(Counter(issues), Counter(technologies), Counter(stage), Counter(organization), Counter(positions))
