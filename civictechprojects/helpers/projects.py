from civictechprojects.models import ProjectPosition
from common.helpers.dictionaries import merge_dicts
from collections import Counter


# Gets a breakdown of all issue/technology/position tags used in the given list of projects
def projects_tag_counts(projects):
    # Get list of all tags used
    issues, technologies, stage, organization, positions = [], [], [], [], []
    for project in projects:
        issues += project.project_issue_area.slugs()
        technologies += project.project_technologies.slugs()
        stage += project.project_stage.slugs()
        organization += project.project_organization.slugs()

        project_positions = ProjectPosition.objects.filter(position_project=project.id)
        positions += map(lambda position: position.position_role.slugs()[0], project_positions)

    # Get the counts of all the tags used
    return merge_dicts(Counter(issues), Counter(technologies), Counter(stage), Counter(organization), Counter(positions))
