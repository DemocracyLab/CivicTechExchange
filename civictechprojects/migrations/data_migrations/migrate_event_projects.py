from civictechprojects.models import Event, EventProject


def migrate_event_projects(*args):
    events = Event.objects.all()
    for event in events:
        print('Migrating projects for event: ' + event.__str__())
        # Get list of projects for event
        event_projects = event.get_linked_projects()
        for project in event_projects:
            print('Migrating project: ' + project.__str__())
            # Create Event Project from Project
            event_project = EventProject.create(project.project_creator, event, project)
            event_project.save()
            # Remove event tag from Project
            project.project_organization.remove(event.event_legacy_organization)

