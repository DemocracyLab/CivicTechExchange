from civictechprojects.models import Project, ProjectPosition
from common.helpers.dictionaries import merge_dicts
from collections import Counter
from pprint import pprint

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
            # Get the counts of all the tags used
            
        return merge_dicts(Counter(issues), Counter(technologies), Counter(stage), Counter(organization), Counter(positions))


            # sc = Counter(k['tag_name'] for k in projects if k.get('tag_name'))
            # sc = Counter(projects)
            # return sc
