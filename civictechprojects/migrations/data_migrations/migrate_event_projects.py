from civictechprojects.models import Event, EventProject, Project


def get_event_legacy_projects(event):
    legacy_slugs = event.event_legacy_organization.slugs()
    if legacy_slugs:
        return Project.objects.filter(project_organization__name__in=legacy_slugs, is_searchable=True)


def migrate_event_projects(*args):
    # TODO: Migrate existing video events to link_video
    events = Event.objects.all()
    for event in events:
        print('Migrating projects for event: ' + event.__str__())
        # Get list of legacy projects for event
        event_projects = get_event_legacy_projects(event)
        if event_projects:
            for project in event_projects:
                # Check to see if event project is already created
                event_project = EventProject.get(event.id, project.id)
                if not event_project:
                    print('Migrating project: ' + project.__str__())
                    # Create Event Project from Project
                    event_project = EventProject.create(project.project_creator, event, project)
                    event_project.save()
                    # Remove event tag from Project
                    project.project_organization.remove(event.event_legacy_organization)
                else:
                    print('{project} has already been migrated'.format(project=project.__str__()))

