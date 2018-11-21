def is_json_field_empty(field_json):
    if isinstance(field_json, dict):
        return len(field_json.keys()) == 0
    else:
        return len(field_json) == 0

def is_creator_or_staff(user, project):
    return (user.username == project.project_creator.username) or user.is_staff