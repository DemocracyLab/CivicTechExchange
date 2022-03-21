
def get_project_position_id(volunteer_relation) -> int:
    from civictechprojects.models import ProjectPosition
    role = f"'{volunteer_relation.role.names().first()}'"
    position_id = None
    positions = ProjectPosition.objects.raw(f'SELECT civictechprojects_projectposition.id FROM \
        civictechprojects_projectposition INNER JOIN civictechprojects_taggedpositionrole ON \
        (civictechprojects_projectposition.id = civictechprojects_taggedpositionrole.content_object_id) INNER JOIN \
        taggit_tag ON (civictechprojects_taggedpositionrole.tag_id = taggit_tag.id) WHERE \
        position_project_id = {volunteer_relation.project_id} AND taggit_tag.name = {role}')
    for position in positions:
        position_id = position.id
    return position_id
