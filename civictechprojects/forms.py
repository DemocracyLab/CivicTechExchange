from django.forms import ModelForm
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from .models import Project, ProjectLink, ProjectFile, ProjectPosition, FileCategory, Event, Group, NameRecord, \
    EventProject, EventConferenceRoom
from .sitemaps import SitemapPages
from democracylab.emails import send_project_creation_notification, send_group_creation_notification, \
    send_event_creation_notification, notify_project_owners_event_rsvp
from democracylab.models import get_request_contributor
from .caching.cache import ProjectSearchTagsCache
from salesforce import campaign as salesforce_campaign
from common.helpers.date_helpers import parse_front_end_datetime
from common.helpers.form_helpers import is_creator, is_creator_or_staff, is_co_owner_or_staff, read_form_field_string, \
    read_form_field_boolean, merge_json_changes, merge_single_file, read_form_field_tags, read_form_field_datetime, \
    read_form_fields_point, read_form_field


class ProjectCreationForm(ModelForm):
    class Meta:
        model = Project
        fields = '__all__'

    @staticmethod
    def delete_project(request, project_id):
        project = Project.objects.get(id=project_id)

        if not is_creator_or_staff(request.user, project):
            raise PermissionDenied()

        linked_groups = project.get_project_groups()
        linked_events = project.get_project_events()
        project_creator = project.project_creator
        project.delete()
        project_creator.purge_cache()
        # Refresh linked event tag counts
        for event in linked_events:
            ProjectSearchTagsCache.refresh(event=event, group=None)
        # Refresh linked group info
        for group in linked_groups:
            group.recache()
            ProjectSearchTagsCache.refresh(event=None, group=group)
        SitemapPages.update()

    @staticmethod
    def create_or_edit_project(request, project_id):
        form = ProjectCreationForm(request.POST)
        if project_id is not None:
            project = Project.objects.get(id=project_id)
        else:
            project = Project.objects.create(
                project_creator=get_request_contributor(request),
                project_name=form.data.get('project_name'),
                project_date_created=timezone.now(),
                is_created=False
            )

        if not is_co_owner_or_staff(request.user, project):
            raise PermissionDenied()

        is_created_original = project.is_created
        read_form_field_boolean(project, form, 'is_created')

        fields_changed = False
        fields_changed |= read_form_field_string(project, form, 'project_description')
        fields_changed |= read_form_field_string(project, form, 'project_description_solution')
        fields_changed |= read_form_field_string(project, form, 'project_description_actions')
        fields_changed |= read_form_field_string(project, form, 'project_short_description')
        fields_changed |= read_form_field_string(project, form, 'project_location')
        fields_changed |= read_form_field_string(project, form, 'project_country')
        fields_changed |= read_form_field_string(project, form, 'project_state')
        fields_changed |= read_form_field_string(project, form, 'project_city')
        fields_changed |= read_form_field_string(project, form, 'project_name')
        fields_changed |= read_form_field_string(project, form, 'project_url')

        fields_changed |= read_form_field_boolean(project, form, 'is_private')

        read_form_fields_point(project, form, 'project_location_coords', 'project_latitude', 'project_longitude')

        tags_changed = False
        tags_changed |= read_form_field_tags(project, form, 'project_issue_area')
        tags_changed |= read_form_field_tags(project, form, 'project_stage')
        tags_changed |= read_form_field_tags(project, form, 'project_technologies')
        tags_changed |= read_form_field_tags(project, form, 'project_organization_type')
        legacy_org_changed = read_form_field_tags(project, form, 'project_organization')
        tags_changed |= legacy_org_changed

        slug = form.data.get('project_slug')
        if slug is not None:
            slug = slug.lower()
            slug_project = Project.get_by_id_or_slug(slug)
            if slug_project and slug_project.id != project.id:
                print('Could not change project {project} slug to {slug} because another project already has that slug: {existing_project}'.format(
                    project=project.__str__(),
                    slug=slug,
                    existing_project=slug_project.__str__()
                ))
            else:
                slug_changed = read_form_field_string(project, form, 'project_slug', lambda str: str.lower())
                if slug_changed:
                    fields_changed = True
                    name_record = NameRecord.objects.create(project=project, name=slug)
                    name_record.save()

        if not request.user.is_staff:
            project.project_date_modified = timezone.now()

        from_event_id = read_form_field(form, 'from_event_id')
        if from_event_id:
            event = Event.objects.get(id=from_event_id)
            project.event_created_from = event

        project.save()
        if project.is_searchable:
            salesforce_campaign.save(project)

        fields_changed |= merge_json_changes(ProjectLink, project, form, 'project_links')
        fields_changed |= merge_json_changes(ProjectFile, project, form, 'project_files')
        tags_changed |= merge_json_changes(ProjectPosition, project, form, 'project_positions')

        fields_changed |= merge_single_file(project, form, FileCategory.THUMBNAIL, 'project_thumbnail')

        fields_changed |= tags_changed

        if is_created_original != project.is_created:
            print('notifying project creation')
            send_project_creation_notification(project)

        if project.is_searchable and tags_changed:
            ProjectSearchTagsCache.refresh()
            if legacy_org_changed:
                project.update_linked_items()

        if fields_changed:
            project.recache(recache_linked=True)
            project.project_creator.purge_cache()

        return project


class EventCreationForm(ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

    @staticmethod
    def create_or_edit_event(request, event_id):
        form = EventCreationForm(request.POST)
        if event_id is not None:
            event = Event.objects.get(id=event_id)
        else:
            event = Event.objects.create(
                event_creator=get_request_contributor(request),
                event_date_created=timezone.now(),
                event_name=form.data.get('event_name'),
                event_date_start=parse_front_end_datetime(form.data.get('event_date_start')),
                event_date_end=parse_front_end_datetime(form.data.get('event_date_end')),
                is_created=False,
                is_searchable=False,
                show_headers=False
            )

        if not is_co_owner_or_staff(request.user, event):
            raise PermissionDenied()

        is_created_original = event.is_created
        fields_changed = False
        project_fields_changed = False
        fields_changed |= read_form_field_string(event, form, 'event_agenda')
        fields_changed |= read_form_field_string(event, form, 'event_description')
        fields_changed |= read_form_field_string(event, form, 'event_short_description')
        project_fields_changed |= read_form_field_string(event, form, 'event_name')
        project_fields_changed |= read_form_field_string(event, form, 'event_location')
        fields_changed |= read_form_field_string(event, form, 'event_rsvp_url')
        fields_changed |= read_form_field_string(event, form, 'event_live_id')
        project_fields_changed |= read_form_field_string(event, form, 'event_organizers_text')

        project_fields_changed |= read_form_field_datetime(event, form, 'event_date_start')
        project_fields_changed |= read_form_field_datetime(event, form, 'event_date_end')

        fields_changed |= read_form_field_boolean(event, form, 'is_searchable')
        fields_changed |= read_form_field_boolean(event, form, 'is_created')
        fields_changed |= read_form_field_boolean(event, form, 'show_headers')
        project_fields_changed |= read_form_field_boolean(event, form, 'is_private')

        slug = form.data.get('event_slug')
        if slug is not None:
            slug = slug.lower()
            slug_event = Event.get_by_id_or_slug(slug)
            if slug_event and slug_event.id != event.id:
                print('Could not change event {event} slug to {slug} because another event already has that slug: {existing_event}'.format(
                    event=event.__str__(),
                    slug=slug,
                    existing_event=slug_event.__str__()
                ))
            else:
                slug_changed = read_form_field_string(event, form, 'event_slug', lambda str: str.lower())
                if slug_changed:
                    project_fields_changed = True
                    name_record = NameRecord.objects.create(event=event, name=slug)
                    name_record.save()

        pre_change_projects = event.get_linked_projects()
        pre_change_projects = pre_change_projects and list(pre_change_projects.all())
        org_changed = read_form_field_tags(event, form, 'event_legacy_organization')
        project_fields_changed |= org_changed

        event.event_date_modified = timezone.now()

        project_fields_changed |= merge_single_file(event, form, FileCategory.THUMBNAIL, 'event_thumbnail')

        event.save()

        if is_created_original != event.is_created:
            send_event_creation_notification(event)

        if fields_changed or project_fields_changed:
            event.recache()
            event.event_creator.purge_cache()
        if project_fields_changed:
            change_projects = []
            if pre_change_projects:
                change_projects += pre_change_projects
            post_change_projects = event.get_linked_projects()
            if post_change_projects: 
                change_projects += post_change_projects.all()
            change_projects = list(set(change_projects))
            if change_projects:
                for project in change_projects:
                    project.recache(recache_linked=False)

        return event

    @staticmethod
    def delete_event(request, event_id):
        event = Event.objects.get(id=event_id)

        if not is_creator_or_staff(request.user, event):
            raise PermissionDenied()

        user = event.event_creator
        event.delete()
        user.purge_cache()


class GroupCreationForm(ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

    @staticmethod
    def create_or_edit_group(request, group_id):
        form = GroupCreationForm(request.POST)
        if group_id is not None:
            group = Group.objects.get(id=group_id)
        else:
            group = Group.objects.create(
                group_creator=get_request_contributor(request),
                group_date_created=timezone.now(),
                group_name=form.data.get('group_name'),
                group_short_description=form.data.get('group_short_description'),
                group_description=form.data.get('group_description'),
                is_created=False
            )

        if not is_co_owner_or_staff(request.user, group):
            raise PermissionDenied()

        is_created_original = group.is_created
        read_form_field_boolean(group, form, 'is_created')

        fields_changed = False
        project_fields_changed = False
        fields_changed |= read_form_field_string(group, form, 'group_description')
        fields_changed |= read_form_field_string(group, form, 'group_short_description')
        fields_changed |= read_form_field_string(group, form, 'group_country')
        fields_changed |= read_form_field_string(group, form, 'group_location')
        fields_changed |= read_form_field_string(group, form, 'group_state')
        fields_changed |= read_form_field_string(group, form, 'group_city')
        fields_changed |= read_form_field_string(group, form, 'group_url')
        project_fields_changed |= read_form_field_string(group, form, 'group_name')
        project_fields_changed |= read_form_field_boolean(group, form, 'is_private')

        read_form_fields_point(group, form, 'group_location_coords', 'group_latitude', 'group_longitude')

        slug = form.data.get('group_slug')
        if slug is not None:
            slug = slug.lower()
            slug_group = Group.get_by_id_or_slug(slug)
            if slug_group and slug_group.id != group.id:
                print('Could not change group {group} slug to {slug} because another group already has that slug: {existing_group}'.format(
                    group=group.__str__(),
                    slug=slug,
                    existing_group=slug_group.__str__()
                ))
            else:
                slug_changed = read_form_field_string(group, form, 'group_slug', lambda str: str.lower())
                if slug_changed:
                    fields_changed = True
                    name_record = NameRecord.objects.create(group=group, name=slug)
                    name_record.save()

        if is_creator(request.user, group):
            group.group_date_modified = timezone.now()

        group.save()

        fields_changed |= merge_json_changes(ProjectLink, group, form, 'group_links')
        fields_changed |= merge_json_changes(ProjectFile, group, form, 'group_files')

        project_fields_changed |= merge_single_file(group, form, FileCategory.THUMBNAIL, 'group_thumbnail')

        fields_changed |=  project_fields_changed

        if project_fields_changed:
            group.update_linked_items()
        if fields_changed:
            group.recache()
            group.group_creator.purge_cache()

        if is_created_original != group.is_created:
            send_group_creation_notification(group)

        return group

    @staticmethod
    def delete_group(request, group_id):
        group = Group.objects.get(id=group_id)

        if not is_creator_or_staff(request.user, group):
            raise PermissionDenied()

        group_creator = group.group_creator
        group.delete()
        group_creator.purge_cache()


class EventProjectCreationForm(ModelForm):
    class Meta:
        model = EventProject
        fields = '__all__'

    @staticmethod
    def create_or_edit_event_project(request, event_id, project_id):
        form = ProjectCreationForm(request.POST)
        event = Event.get_by_id_or_slug(event_id)
        project = Project.objects.get(id=project_id)
        if not is_co_owner_or_staff(request.user, project):
            raise PermissionDenied()

        event_project = EventProject.get(event_id, project_id)
        fields_changed = False
        recache_linked = False
        if not event_project:
            user = get_request_contributor(request)
            event_project = EventProject.create(user, event, project)
            event_project.save()
            if event.is_activated:
                EventConferenceRoom.create_for_entity(event, event_project)
            notify_project_owners_event_rsvp(event_project)
            fields_changed = True
            recache_linked = True

        fields_changed |= read_form_field_string(event_project, form, 'goal')
        fields_changed |= read_form_field_string(event_project, form, 'scope')
        fields_changed |= read_form_field_string(event_project, form, 'schedule')
        fields_changed |= read_form_field_string(event_project, form, 'onboarding_notes')

        # TODO: Add to model
        # if not request.user.is_staff:
        #     project.project_date_modified = timezone.now()

        event_project.save()

        fields_changed |= merge_json_changes(ProjectLink, event_project, form, 'event_project_links')
        fields_changed |= merge_json_changes(ProjectPosition, event_project, form, 'event_project_positions')

        if fields_changed:
            # Only recache linked projects/event on initial creation
            event_project.recache()
            event.recache()
            if recache_linked:
                project.recache(recache_linked=False)
                project.project_creator.purge_cache()

        return event_project
