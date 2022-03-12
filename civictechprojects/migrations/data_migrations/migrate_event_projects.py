from civictechprojects.models import Event, EventProject
from democracylab.logging import log_memory_usage


def migrate_event_projects(*args):
    events = Event.objects.all()
    for event in events:
        print('Migrating projects for event: ' + event.__str__())
        log_memory_usage()
        # Get list of projects for event
        event_projects = event.get_linked_projects()
        if event_projects:
            for project in event_projects:
                # Check to see if event project is already created
                event_project = EventProject.get(event.id, project.id)
                if not event_project:
                    print('Migrating project: ' + project.__str__())
                    log_memory_usage()
                    # Create Event Project from Project
                    event_project = EventProject.create(project.project_creator, event, project)
                    event_project.save()
                    # Remove event tag from Project
                    project.project_organization.remove(event.event_legacy_organization)
                else:
                    print('{project} has already been migrated'.format(project=project.__str__()))

